import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTx, QueryTx, UpdateTx } from "../../../packages/dtos/tx.dto";
import { Api } from "../api/api";

export function useGetAllTx() {
  return useQuery({
    queryFn: () => Api.tx.getAll(),
    queryKey: ["tx", "getAll"],
  });
}

// Hook para criar uma consulta via POST
export function useQueryTx() {
  return useMutation({
    mutationFn: (data: QueryTx) => Api.tx.query(data),
})}


// Hook para buscar muitas Tx
export function useGetManyTx(skip: number) {
  return useQuery({
    queryFn: () => Api.tx.getMany(skip), 
    queryKey: ["tx", "getMany"], 
  });
}

export function useGetTx(id: string) {
  return useQuery({
    queryFn: () => Api.tx.get(id),
    queryKey: ["tx", "get", id],
  });
}

export function usePostTx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTx) => Api.tx.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tx", "getMany"] });
    },
  });
}

export function usePutTx(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTx) => Api.tx.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tx", "getMany"]});
    },
  });
}

export function useDeleteTx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tx.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tx", "getMany"]});
    },
  });
}