/* eslint-disable @typescript-eslint/no-explicit-any */
// providers/userDataProvider.ts
import { axiosInstance } from "@/utils/axiosInstance";
import { DataProvider } from "@refinedev/core";


const API_URL = "http://localhost:8000/api/v1";

export const userDataProvider: DataProvider = {
  getList: async ({ resource, pagination, filters }) => {
    const { currentPage = 1, pageSize = 10 } = pagination || {};
    
    // Handle search filter
    const searchParam = filters?.find((f: any) => f.field === "search");
    const searchQuery = searchParam?.value ? `&search=${searchParam.value}` : "";

    const url = `/admin/${resource}?page=${currentPage}&limit=${pageSize}${searchQuery}`;

    const { data } = await axiosInstance.get(url);

    return {
      data: data.data,
      total: data.meta.total,
    };
  },

  getOne: async ({ resource, id }) => {
    const url = `/admin/${resource}/${id}`;
    const { data } = await axiosInstance.get(url);

    return {
      data: data,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `/admin/${resource}`;
    const { data } = await axiosInstance.post(url, variables);

    return {
      data,
    };
  },

  update: async ({ resource, id, variables }) => {
    const url = `/admin/${resource}/${id}`;
    const { data } = await axiosInstance.patch(url, variables);

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `/admin/${resource}/${id}`;
    const { data } = await axiosInstance.delete(url);

    return {
      data,
    };
  },

  getApiUrl: () => API_URL,
};