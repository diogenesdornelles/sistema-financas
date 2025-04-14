import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreatePartner, QueryPartner, UpdatePartner } from "../../../packages/dtos/partner.dto"; 
import { Api } from "../api/api"; 

// Hook para buscar todos os 'partners'
export function useGetAllPartner() {
  return useQuery({
    queryFn: () => Api.partner.getAll(), 
    queryKey: ["partner", "getAll"], 
  });
}

// Hook para buscar muitas Partners
export function useGetManyPartner(skip: number) {
  return useQuery({
    queryFn: () => Api.partner.getMany(skip), 
    queryKey: ["partner", "getMany"], 
  });
}

// Hook para criar uma consulta via POST
export function useQueryPartner() {
  return useMutation({
    mutationFn: (data: QueryPartner) => Api.partner.query(data),
})}

// Hook para buscar um 'partner' específico pelo ID
export function useGetPartner(id: string) {
  return useQuery({
    queryFn: () => Api.partner.get(id), 
    queryKey: ["partner", "get"], 
  });
}

// Hook para criar um novo 'partner' (POST)
export function usePostPartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePartner) => Api.partner.post(data), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner", "getMany"] }); 
    },
  });
}

// Hook para atualizar um 'partner' existente (PUT)
export function usePutPartner(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdatePartner) => Api.partner.put(data, id), 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["partner", "getMany"] }); 
    },
  });
}

// Hook para deletar um 'partner' pelo ID
export function useDeletePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.partner.delete(id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partner", "getMany"] }); 
    },
  });
}