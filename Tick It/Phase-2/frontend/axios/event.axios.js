import { instance } from "./ApiAxios";

export const getEvents = async (filter) => {
  const data = await instance.get(`/events`, {
    params: {
      filter,
    },
  });
  return data;
};

export const getEventsFiltered = async (categoryIds, location, from, to, search) => {
  const data = await instance.get(`/events/filtered`, {
    params: {
      categoryIds: categoryIds,
      location: location,
      from: from,
      to: to,
      search: search
    }
  })
  return data;
}

export const getCategories = async (filter) => {
  const data = await instance.get(`/categories`, {
    params: {
      filter,
    },
  });
  return data;
};

export const postEvent = async (payload) => {
  const data = await instance.post("/events", payload,{
  headers: {
    Authorization: localStorage.getItem("token")
  }
});
  return data.data;
};

export const updateEvent = async (payload, eventId) => {
  const data = await instance.put(`/events/${eventId}`, payload, {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  });
  return data.data
}
