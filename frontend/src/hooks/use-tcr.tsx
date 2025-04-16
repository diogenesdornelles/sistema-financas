import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTcr, QueryTcr, UpdateTcr } from "../../../packages/dtos/tcr.dto";
import { Api } from "../api/api";

export function useGetAllTcr() {
  return useQuery({
    queryFn: () => Api.tcr.getAll(),
    queryKey: ["tcr", "getAll"],
  });
}

// Hook para buscar muitas Tcf
export function useGetManyTcr(skip: number) {
  return useQuery({
    queryFn: () => Api.tcr.getMany(skip), 
    queryKey: ["tcr", "getMany", skip], 
  });
}

// Hook para criar uma consulta via POST
export function useQueryTcr() {

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryTcr) => Api.tcr.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcr", "getMany"], exact: false
       });
    },
})}


export function useGetTcr(id: string) {
  return useQuery({
    queryFn: () => Api.tcr.get(id),
    queryKey: ["tcr", "get", id],
  });
}

export function usePostTcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcr) => Api.tcr.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcr", "getMany"], exact: false
       });
    },
  });
}

export function usePutTcr(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcr) => Api.tcr.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcr", "getMany"], exact: false
       });
    },
  });
}

export function useDeleteTcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcr.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcr", "getMany"], exact: false
       });
    },
  });
}