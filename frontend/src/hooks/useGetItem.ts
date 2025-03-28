import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/api";


export function useGetItem(id: string) {
  return useQuery({
    queryFn: () => Api.getItem(id),
    queryKey: ["useGetItem", id],
  });
}

// importa e desestrutura const { isPending, error, data } // https://tanstack.com/query/latest/docs/framework/react/overview