import { instance } from "./ApiAxios";

export const postOrganization = async (payload) => {
  const data = await instance.post(`/organizations`, payload, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return data;
};
export const getOrganization = async (filter) => {
  const data = await instance.get(`/organizations`, {
    params: {
      filter,
    },
  });
  return data;
};
