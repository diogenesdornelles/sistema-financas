import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();

const restClient = axios.create({
  baseURL: "...", // url
});

export { queryClient, restClient };