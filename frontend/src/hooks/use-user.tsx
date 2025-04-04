import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUser, UpdateUser } from "../../../packages/dtos/user.dto";
import { Api } from "../api/api";

export function useGetAllUser() {
  return useQuery({
    queryFn: () => Api.user.getAll(),
    queryKey: ["User", "getAll"],
  });
}

export function useGetUser(id: string) {
  return useQuery({
    queryFn: () => Api.user.get(id),
    queryKey: ["User", "get", id],
  });
}

export function usePostUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUser) => Api.user.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User", "getAll"] });
    },
  });
}

export function usePutUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUser) => Api.user.put(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User", "getAll"]});
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.user.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["User", "getAll"]});
    },
  });
}