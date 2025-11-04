/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataProvider } from "@refinedev/core";
import { axiosInstance } from "@/utils/axiosInstance";
import { toast } from "sonner";

const API_URL = "http://localhost:8000/api/v1";

export const planDataProvider: DataProvider = {
    getList: async ({ resource, pagination }) => {
        const { currentPage = 1, pageSize = 10 } = pagination || {};

        const url = `/admin/${resource}?page=${currentPage}&limit=${pageSize}`;

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
        try {
            const { data } = await axiosInstance.post(`/admin/${resource}`, variables);
            toast.success("Plan created successfully");
            return { data };
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to create plan");
            throw error;
        }
    },

    update: async ({ resource, id, variables }) => {
        try {
            const { data } = await axiosInstance.patch(`/admin/${resource}/${id}`, variables);
            toast.success("Plan updated successfully");
            return { data };
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update plan");
            throw error;
        }
    },

    deleteOne: async ({ resource, id }) => {
        try {
            const { data } = await axiosInstance.delete(`/admin/${resource}/${id}`);
            toast.success("Plan deleted successfully");
            return { data };
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete plan");
            throw error;
        }
    },

    getApiUrl: () => API_URL,

};
