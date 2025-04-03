import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTcf, UpdateTcf } from "../../../packages/dtos/tcf.dto";
import { Api } from "../api/api";

export function useGetAllTcf() {
  return useQuery({
    queryFn: () => Api.tcf.getAll(),
    queryKey: ["tcf", "getAll"],
  });
}

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
      queryClient.invalidateQueries({ queryKey: ["tcf", "getAll"] });
    },
  });
}

export function usePutTcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcf) => Api.tcf.put(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getAll"]});
    },
  });
}

export function useDeleteTcf() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcf.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tcf", "getAll"]});
    },
  });
}