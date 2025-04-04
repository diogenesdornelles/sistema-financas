import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCf, UpdateCf } from "../../../packages/dtos/cf.dto"; 
import { Api } from "../api/api"; 

// Hook para buscar todos os 'cf'
export function useGetAllCf() {
  return useQuery({
    queryFn: () => Api.cf.getAll(), 
    queryKey: ["cf", "getAll"],   
  });
}

// Hook para buscar um 'cf' específico pelo ID
export function useGetCf(id: string) {
  return useQuery({
    queryFn: () => Api.cf.get(id), 
    queryKey: ["cf", "get", id],   // Usar 'cf' na chave
  });
}

// Hook para criar um novo 'cf' (POST)
export function usePostCf() { 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCf) => Api.cf.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cf", "getAll"] });
    },
  });
}

// Hook para atualizar um 'cf' existente (PUT)
export function usePutCf() { 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCf) => Api.cf.put(data),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["cf", "getAll"] }); 
    },
  });
}

// Hook para deletar um 'cf' pelo ID
export function useDeleteCf() { 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cf.delete(id), // Usar Api.cf
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cf", "getAll"] }); // Usar 'cf' na chave
    },
  });
}