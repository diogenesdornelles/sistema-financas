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
    queryKey: ["tcf", "getMany"], 
  });
}


// Hook para criar uma consulta via POST
export function useQueryTcf() {
  return useMutation({
    mutationFn: (data: QueryTcf) => Api.tcf.query(data),
})}

export function useGetTcf(id: string) {
  return useQuery({
    queryFn: () => Api.tcf.get(id),
    queryKey: ["tcf", "get"],
  });
}

export function usePostTcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcf) => Api.tcf.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getMany"] });
    },
  });
}

export function usePutTcf(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcf) => Api.tcf.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getMany"]});
    },
  });
}

export function useDeleteTcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcf.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getMany"]});
    },
  });
}