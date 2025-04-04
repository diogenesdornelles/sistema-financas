import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCat, UpdateCat } from "../../../packages/dtos/cat.dto"; 
import { Api } from "../api/api"; 

// Hook para buscar todos os 'cats'
export function useGetAllCat() {
  return useQuery({
    // Chama a função da API para buscar todos os 'cats'
    queryFn: () => Api.cat.getAll(), 
    // Chave de query para identificar esta busca
    queryKey: ["cat", "getAll"], 
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
      queryClient.invalidateQueries({ queryKey: ["cat", "getAll"] }); 
    },
  });
}

// Hook para atualizar um 'cat' existente (PUT)
export function usePutCat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCat) => Api.cat.put(data), 
    onSuccess: (data) => { 
      console.log(data)
      queryClient.invalidateQueries({ queryKey: ["cat", "getAll"] }); 
    },
  });
}

// Hook para deletar um 'cat' pelo ID
export function useDeleteCat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cat.delete(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cat", "getAll"] }); 
    },
  });
}