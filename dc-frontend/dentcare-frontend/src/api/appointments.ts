import api from "./axios";
import type { Appointment, AppointmentRequest } from "../types";

export const bookAppointment = async (data: AppointmentRequest): Promise<Appointment> => {
  const response = await api.post<Appointment>("/api/patient/appointments", data);
  return response.data;
};

export const getPatientAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>("/api/patient/appointments");
  return response.data;
};

export const getDoctorAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>("/api/doctor/appointments");
  return response.data;
};

export const getAllAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>("/api/admin/appointments");
  return response.data;
};

export const updateAppointmentStatus = async (id: number, status: string): Promise<Appointment> => {
  const response = await api.put<Appointment>(`/api/admin/appointments/${id}/status?status=${status}`);
  return response.data;
};

export const cancelAppointment = async (id: number): Promise<void> => {
  await api.put(`/api/patient/appointments/${id}/cancel`);
};