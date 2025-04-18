import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/api"; 


// Hook para buscar balanços de CF
export function useGetBalances(date: string) {
  return useQuery({
    queryFn: () => Api.db.getBalances(date), 
    queryKey: ["cf", "getBalances"],
  });
}

// Hook para buscar contas a pagar e a receber de acordo com data
export function useGetCpsCrs(date: string) {
  return useQuery({
    queryFn: () => Api.db.getCpsCrs(date), 
    queryKey: ["cp", "cr", "getCpsCrs"],
  });
}
