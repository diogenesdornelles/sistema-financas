import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTcf, QueryTcf, UpdateTcf } from "../../../packages/dtos/tcf.dto";
import { Api } from "../api/api";

export function useGetAllTcf() {
  return useQuery({
    queryFn: () => Api.tcf.getAll(),
    queryKey: ["tcf", "getAll"],
  });
}

// Hook para buscar muitas Tcf
export function useGetManyTcf(skip: number) {
  return useQuery({
    queryFn: () => Api.tcf.getMany(skip), 
    queryKey: ["tcf", "getMany", skip], 
  });
}


// Hook para criar uma consulta via POST
export function useQueryTcf() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryTcf) => Api.tcf.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getMany"], exact: false });
    },
})}

export function useGetTcf(id: string) {
  return useQuery({
    queryFn: () => Api.tcf.get(id),
    queryKey: ["tcf", "get", id],
  });
}

export function usePostTcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcf) => Api.tcf.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getMany"], exact: false });
    },
  });
}

export function usePutTcf(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcf) => Api.tcf.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getMany"], exact: false });
    },
  });
}

export function useDeleteTcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcf.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getMany"], exact: false });
    },
  });
}