import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTcp, QueryTcp, UpdateTcp } from "../../../packages/dtos/tcp.dto";
import { Api } from "../api/api";

export function useGetAllTcp() {
  return useQuery({
    queryFn: () => Api.tcp.getAll(),
    queryKey: ["tcp", "getAll"],
  });
}

// Hook para buscar muitas Tcp
export function useGetManyTcp(skip: number) {
  return useQuery({
    queryFn: () => Api.tcp.getMany(skip), 
    queryKey: ["tcp", "getMany", skip], 
  });
}

// Hook para criar uma consulta via POST
export function useQueryTcp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryTcp) => Api.tcp.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcp", "getMany"], exact: false});
    },
})}

export function useGetTcp(id: string) {
  return useQuery({
    queryFn: () => Api.tcp.get(id),
    queryKey: ["tcp", "get", id],
  });
}

export function usePostTcp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcp) => Api.tcp.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcp", "getMany"], exact: false});
    },
  });
}

export function usePutTcp(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcp) => Api.tcp.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcp", "getMany"], exact: false});
    },
  });
}

export function useDeleteTcp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcp.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcp", "getMany"], exact: false});
    },
  });
}