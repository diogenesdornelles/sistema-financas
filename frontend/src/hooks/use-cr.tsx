import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCr, UpdateCr } from "../../../packages/dtos/cr.dto"; 
import { Api } from "../api/api"; 

// Hook para buscar todos os 'cr'
export function useGetAllCr() {
  return useQuery({
    queryFn: () => Api.cr.getAll(), 
    queryKey: ["cr", "getAll"], 
  });
}

// Hook para buscar um 'cr' específico pelo ID
export function useGetCr(id: string) {
  return useQuery({
    queryFn: () => Api.cr.get(id), 
    queryKey: ["cr", "get", id], 
  });
}

// Hook para criar um novo 'cr' (POST)
export function usePostCr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCr) => Api.cr.post(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cr", "getAll"] }); 
    },
  });
}

// Hook para atualizar um 'cr' existente (PUT)
export function usePutCr() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateCr) => Api.cr.put(data), 
    onSuccess: (/* data */) => { 
      queryClient.invalidateQueries({ queryKey: ["cr", "getAll"] }); 

    },
  });
}

// Hook para deletar um 'cr' pelo ID
export function useDeleteCr() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cr.delete(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cr", "getAll"] }); 
    },
  });
}