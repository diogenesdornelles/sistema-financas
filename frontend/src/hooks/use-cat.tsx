import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCat, QueryCat, UpdateCat } from "../../../packages/dtos/cat.dto"; 
import { Api } from "../api/api"; 

// Hook para buscar todos os 'cats'
export function useGetAllCat() {
  return useQuery({
    queryFn: () => Api.cat.getAll(), 
    queryKey: ["cat", "getAll"],
  });
}

// Hook para buscar 'cats'
export function useGetManyCat(skip: number) {
  return useQuery({
    queryFn: () => Api.cat.getMany(skip), 
    queryKey: ["cat", "getMany"],
  });
}

// Hook para buscar um 'cat' específico pelo ID
export function useGetCat(id: string) {
  return useQuery({
    queryFn: () => Api.cat.get(id), 
    queryKey: ["cat", "get", id], 
  });
}

// Hook para criar um novo 'cat' (POST)
export function usePostCat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCat) => Api.cat.post(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cat", "getMany"] }); 
    },
  });
}

// Hook para criar uma consulta via POST
export function useQueryCat() {
  return useMutation({
    mutationFn: (data: QueryCat) => Api.cat.query(data),
})}

// Hook para atualizar um 'cat' existente (PUT)
export function usePutCat(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCat) => Api.cat.put(data, id), 
    onSuccess: (data) => { 
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ["cat", "getMany"] }); 
    },
  });
}

// Hook para deletar um 'cat' pelo ID
export function useDeleteCat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cat.delete(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cat", "getMany"] }); 
    },
  });
}