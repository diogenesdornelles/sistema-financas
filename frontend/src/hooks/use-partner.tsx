import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatePartner, UpdatePartner } from "../../../packages/dtos/partner.dto"; 
import { Api } from "../api/api"; 

// Hook para buscar todos os 'partners'
export function useGetAllPartner() {
  return useQuery({
    queryFn: () => Api.partner.getAll(), 
    queryKey: ["partner", "getAll"], 
  });
}

// Hook para buscar um 'partner' específico pelo ID
export function useGetPartner(id: string) {
  return useQuery({
    queryFn: () => Api.partner.get(id), 
    queryKey: ["partner", "get", id], 
  });
}

// Hook para criar um novo 'partner' (POST)
export function usePostPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartner) => Api.partner.post(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner", "getAll"] }); 
    },
  });
}

// Hook para atualizar um 'partner' existente (PUT)
export function usePutPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePartner) => Api.partner.put(data), 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["partner", "getAll"] }); 
    },
  });
}

// Hook para deletar um 'partner' pelo ID
export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.partner.delete(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner", "getAll"] }); 
    },
  });
}