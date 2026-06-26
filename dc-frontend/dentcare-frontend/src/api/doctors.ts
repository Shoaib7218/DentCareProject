import api from "./axios";
import type{ Doctor, DoctorRequest,DoctorLeaveResponse } from "../types";

export const getAllDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>("/api/patient/doctors");
  return response.data;
};

export const getAdminDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get<Doctor[]>("/api/admin/doctors");
  return response.data;
};

export const addDoctor = async (data: DoctorRequest): Promise<Doctor> => {
  const response = await api.post<Doctor>("/api/admin/doctors", data);
  return response.data;
};

export const deleteDoctor = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/doctors/${id}`);
};

export const getDoctorLeaves = async (doctorId: number): Promise<DoctorLeaveResponse[]> => {
  const response = await api.get<DoctorLeaveResponse[]>(`/api/doctor/leaves/doctor/${doctorId}`);
  return response.data;
};