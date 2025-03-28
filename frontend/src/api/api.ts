import { restClient } from '../utils/client'
 
import { DataProps } from "../interfaces/data";
  
  export const Api = {
  
    getItem: async (id: string) => {
      const { data } = await restClient.get(id);
  
      const result: DataProps = data;
  
      return result;
    },
  };