import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateCf, QueryCf, UpdateCf } from "../../../packages/dtos/cf.dto"; 
import { Api } from "../api/api"; 

// Hook para buscar todos os 'cf'
export function useGetAllCf() {
  return useQuery({
    queryFn: () => Api.cf.getAll(), 
    queryKey: ["cf", "getAll"],   
  });
}

// Hook para buscar muitas Cf
export function useGetManyCf(skip: number) {
  return useQuery({
    queryFn: () => Api.cf.getMany(skip), 
    queryKey: ["cf", "getMany"],
  });
}


// Hook para buscar um 'cf' específico pelo ID
export function useGetCf(id: string) {
  return useQuery({
    queryFn: () => Api.cf.get(id), 
    queryKey: ["cf", "get"], 
  });
}

// Hook para criar um novo 'cf' (POST)
export function usePostCf() { 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCf) => Api.cf.post(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cf", "getMany"] });
    },
  });
}

// Hook para atualizar um 'cf' existente (PUT)
export function usePutCf(id: string) { 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCf) => Api.cf.put(data, id),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ["cf", "getMany"] }); 
    },
  });
}

// Hook para deletar um 'cf' pelo ID
export function useDeleteCf() { 
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => Api.cf.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cf", "getMany"] });
    },
  });
}

// Hook para criar uma consulta via POST
export function useQueryCf() {
  return useMutation({
    mutationFn: (data: QueryCf) => Api.cf.query(data),
})}