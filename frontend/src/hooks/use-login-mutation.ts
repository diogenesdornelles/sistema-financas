import { useMutation } from "@tanstack/react-query";
import { Api } from "../api/api";
import {CreateToken } from '../../../packages/dtos/token.dto'


export function useLoginMutation() {
  return useMutation({
    mutationFn: (data: CreateToken) => Api.login(data),
  });
}