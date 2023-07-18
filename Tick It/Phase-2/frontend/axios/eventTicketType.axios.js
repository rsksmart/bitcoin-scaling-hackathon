import { instance } from "./ApiAxios";

export const getEventTicketType = async (filter) => {
  const data = await instance.get(`/eventTicketTypes`, {
    params: {
      filter,
    },
  });
  return data;
};

export const postEventTicketType = async (payload) => {
  const data = await instance.post(`/eventTicketTypes`, payload , {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });
  return data;
};

export const postEventTicketTypeBatch = async (payload) => {
  const data = await instance.post(`/eventTicketTypes/batch`, payload, {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });
  return data;
};