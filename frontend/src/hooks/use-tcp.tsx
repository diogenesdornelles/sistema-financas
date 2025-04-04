import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTcp, UpdateTcp } from "../../../packages/dtos/tcp.dto";
import { Api } from "../api/api";

export function useGetAllTcp() {
  return useQuery({
    queryFn: () => Api.tcp.getAll(),
    queryKey: ["Tcp", "getAll"],
  });
}

export function useGetTcp(id: string) {
  return useQuery({
    queryFn: () => Api.tcp.get(id),
    queryKey: ["Tcp", "get", id],
  });
}

export function usePostTcp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTcp) => Api.tcp.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tcp", "getAll"] });
    },
  });
}

export function usePutTcp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcp) => Api.tcp.put(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tcp", "getAll"]});
    },
  });
}

export function useDeleteTcp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcp.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tcp", "getAll"]});
    },
  });
}