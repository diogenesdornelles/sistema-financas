import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTcr, QueryTcr, UpdateTcr } from "../../../packages/dtos/tcr.dto";
import { Api } from "../api/api";

export function useGetAllTcr() {
  return useQuery({
    queryFn: () => Api.tcr.getAll(),
    queryKey: ["Tcr", "getAll"],
  });
}

// Hook para buscar muitas Tcf
export function useGetManyTcr(skip: number) {
  return useQuery({
    queryFn: () => Api.tcr.getMany(skip), 
    queryKey: ["tcr", "getMany"], 
  });
}

// Hook para criar uma consulta via POST
export function useQueryTcr() {
  return useMutation({
    mutationFn: (data: QueryTcr) => Api.tcr.query(data),
})}


export function useGetTcr(id: string) {
  return useQuery({
    queryFn: () => Api.tcr.get(id),
    queryKey: ["Tcr", "get", id],
  });
}

export function usePostTcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcr) => Api.tcr.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tcr", "getMany"] });
    },
  });
}

export function usePutTcr(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcr) => Api.tcr.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tcr", "getMany"]});
    },
  });
}

export function useDeleteTcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcr.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tcr", "getMany"]});
    },
  });
}