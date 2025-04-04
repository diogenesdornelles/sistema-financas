import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCp, UpdateCp } from "../../../packages/dtos/cp.dto"; 
import { Api } from "../api/api"; 

// Hook para buscar todos os 'cp'
export function useGetAllCp() {
  return useQuery({
    queryFn: () => Api.cp.getAll(), 
    queryKey: ["cp", "getAll"], 
  });
}

// Hook para buscar um 'cp' específico pelo ID
export function useGetCp(id: string) {
  return useQuery({
    queryFn: () => Api.cp.get(id), 
    queryKey: ["cp", "get", id], 
  });
}

// Hook para criar um novo 'cp' (POST)
export function usePostCp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCp) => Api.cp.post(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cp", "getAll"] }); 
    },
  });
}

// Hook para atualizar um 'cp' existente (PUT)
export function usePutCp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCp) => Api.cp.put(data), 
    onSuccess: (/* data */) => { 
      queryClient.invalidateQueries({ queryKey: ["cp", "getAll"] }); 
    },
  });
}

// Hook para deletar um 'cp' pelo ID
export function useDeleteCp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cp.delete(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cp", "getAll"] }); 
    },
  });
}