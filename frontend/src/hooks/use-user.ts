import { useQuery } from "@tanstack/react-query";
import { Api } from "../api/api";


export function useGetUser(id: string) {
  return useQuery({
    queryFn: () => Api.user.get(id),
    queryKey: ["user", "get", id],
  });
}

// importa e desestrutura const { isPending, error, data } // https://tanstack.com/query/latest/docs/framework/react/overview