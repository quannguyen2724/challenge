import axios from "axios";
import type { Token } from "../types/token.type";

const tokenApi = {
  getPrices: async (): Promise<Token[]> => {
    const response = await axios.get(
      "https://interview.switcheo.com/prices.json"
    );
    const data = await response.data;
    return data;
  },
};

export default tokenApi;
