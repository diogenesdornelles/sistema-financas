import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTcr, UpdateTcr } from "../../../packages/dtos/tcr.dto";
import { Api } from "../api/api";

export function useGetAllTcr() {
  return useQuery({
    queryFn: () => Api.tcr.getAll(),
    queryKey: ["Tcr", "getAll"],
  });
}

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
      queryClient.invalidateQueries({ queryKey: ["Tcr", "getAll"] });
    },
  });
}

export function usePutTcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTcr) => Api.tcr.put(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tcr", "getAll"]});
    },
  });
}

export function useDeleteTcr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.tcr.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Tcr", "getAll"]});
    },
  });
}