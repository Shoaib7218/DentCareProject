import api from "./axios";
import type { DentalService, DentalServiceRequest } from "../types";

export const getActiveServices = async (): Promise<DentalService[]> => {
  const response = await api.get<DentalService[]>("/api/patient/services");
  return response.data;
};

export const getAllServices = async (): Promise<DentalService[]> => {
  const response = await api.get<DentalService[]>("/api/admin/services");
  return response.data;
};

export const addService = async (data: DentalServiceRequest): Promise<DentalService> => {
  const response = await api.post<DentalService>("/api/admin/services", data);
  return response.data;
};

export const updateService = async (id: number, data: DentalServiceRequest): Promise<DentalService> => {
  const response = await api.put<DentalService>(`/api/admin/services/${id}`, data);
  return response.data;
};

export const deleteService = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/services/${id}`);
};