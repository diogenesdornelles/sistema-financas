import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

const queryClient = new QueryClient();

const restClient = axios.create({
  baseURL: "http://127.0.0.1/", // url
});

export { queryClient, restClient };