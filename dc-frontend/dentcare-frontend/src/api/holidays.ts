import api from "./axios";
import type { ClinicHolidayResponse, ClinicHolidayRequest } from "../types";

export const getUpcomingHolidays = async (): Promise<ClinicHolidayResponse[]> => {
  const response = await api.get<ClinicHolidayResponse[]>("/api/auth/holidays");
  return response.data;
};

export const getAllHolidays = async (): Promise<ClinicHolidayResponse[]> => {
  const response = await api.get<ClinicHolidayResponse[]>("/api/admin/holidays");
  return response.data;
};

export const addHoliday = async (data: ClinicHolidayRequest): Promise<ClinicHolidayResponse> => {
  const response = await api.post<ClinicHolidayResponse>("/api/admin/holidays", data);
  return response.data;
};

export const deleteHoliday = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/holidays/${id}`);
};