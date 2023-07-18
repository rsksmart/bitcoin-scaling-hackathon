import { instance } from "./ApiAxios";

export const getWalletsByUser = async (filter) => {
  const data = await instance.get(`/wallets`, {
    params: {
      filter,
    },
  });
  return data;
};
export const linkWallet = async (payload) => {
  const data = await instance.post("/wallets/link", payload, {
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  return data.data;
};
export const unlinkWallet = async (id) => {
  const data = await instance.delete(
    `/wallets/unlink/${id}`,

    {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    }
  );
  return data.data;
};
