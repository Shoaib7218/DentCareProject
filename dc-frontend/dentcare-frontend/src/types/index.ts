export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
}

export interface Doctor {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  availableDays: string;
  availableTimeStart: string;
  availableTimeEnd: string;
}

export interface DentalService {
  id: number;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  active: boolean;
}

export interface AppointmentRequest {
  doctorId: number;
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
}

export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  serviceName: string;
  servicePrice: number;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  notes: string;
}

export interface DoctorRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  specialization: string;
  qualifications: string;
  experienceYears: number;
  availableDays: string;
  availableTimeStart: string;
  availableTimeEnd: string;
}

export interface DentalServiceRequest {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
}

export interface ClinicHolidayRequest {
  holidayDate: string;
  reason: string;
}

export interface ClinicHolidayResponse {
  id: number;
  holidayDate: string;
  reason: string;
}

export interface DoctorLeaveResponse {
  id: number;
  leaveDate: string;
  reason: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}