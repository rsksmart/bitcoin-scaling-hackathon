import { instance } from "./ApiAxios";

export const getUsers = async (filter) => {
  const data = await instance.get(`/users`, {
    params: {
      filter
    },
  });
  return data;
};

export const updateUser = async (payload) => {
  const data = await instance.put("/users", payload,{
  headers: {
    Authorization: localStorage.getItem("token")
  }
});
  return data.data;
};

export const changePassword = async (payload) => {
  const data = await instance.put("/users/changePassword", payload,{
  headers: {
    Authorization: localStorage.getItem("token")
  }
});
  return data.data;
};