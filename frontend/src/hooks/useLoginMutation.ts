import { useMutation } from "@tanstack/react-query";
import { Api } from "../api/api";
import { CreateToken } from "../interfaces/token.interface";


export function useLoginMutation() {
  return useMutation({
    mutationFn: ({ cpf, pwd }: CreateToken) => Api.login(cpf, pwd),
  });
}