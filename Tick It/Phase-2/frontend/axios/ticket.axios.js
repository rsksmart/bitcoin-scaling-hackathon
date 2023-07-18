import { instance } from "./ApiAxios";

export const postCustodialMint = async (payload) => {
  const data = await instance.post(`/tickets/mint`, payload, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return data;
};

export const getTicketByAddress = async (address) => {
  
  const data = await instance.get(`/tickets`, {
    params:{
      address:address,
      isContract:false
    }
  });
  return data;
};
