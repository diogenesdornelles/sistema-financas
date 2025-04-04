import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTx, UpdateTx } from "../../../packages/dtos/tx.dto";
import { Api } from "../api/api";

export function useGetAllTx() {
  return useQuery({
    queryFn: () => Api.tx.getAll(),
    queryKey: ["Tx", "getAll"],
  });
}

export function useGetTx(id: string) {
  return useQuery({
    queryFn: () => Api.tx.get(id),
    queryKey: ["Tx", "get", id],
  });
}

export function usePostTx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTx) => Api.tx.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tx", "getAll"] });
    },
  });
}

export function usePutTx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTx) => Api.tx.put(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tx", "getAll"]});
    },
  });
}

export function useDeleteTx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tx.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tx", "getAll"]});
    },
  });
}