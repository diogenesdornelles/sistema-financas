import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateUser, QueryUser, UpdateUser } from "../../../packages/dtos/user.dto";
import { Api } from "../api/api";

export function useGetAllUser() {
  return useQuery({
    queryFn: () => Api.user.getAll(),
    queryKey: ["user", "getAll"],
  });
}


// Hook para criar uma consulta via POST
export function useQueryUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: QueryUser) => Api.user.query(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "getMany"], exact: false });
    },
})}

// Hook para buscar muitas User
export function useGetManyUser(skip: number) {
  return useQuery({
    queryFn: () => Api.user.getMany(skip), 
    queryKey: ["user", "getMany", skip], 
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
      queryClient.invalidateQueries({ queryKey: ["user", "getMany"], exact: false });
    },
  });
}

export function usePutUser(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUser) => Api.user.put(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "getMany"], exact: false });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.user.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "getMany"], exact: false });
    },
  });
}