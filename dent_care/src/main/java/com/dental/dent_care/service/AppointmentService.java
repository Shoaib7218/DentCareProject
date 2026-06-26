package com.dental.dent_care.service;

import com.dental.dent_care.dto.AppointmentRequest;
import com.dental.dent_care.dto.AppointmentResponse;
import com.dental.dent_care.entity.Appointment;
import com.dental.dent_care.entity.Doctor;
import com.dental.dent_care.entity.DentalService;
import com.dental.dent_care.entity.User;
import com.dental.dent_care.enums.AppointmentStatus;
import com.dental.dent_care.repository.AppointmentRepository;
import com.dental.dent_care.repository.DoctorRepository;
import com.dental.dent_care.repository.DentalServiceRepository;
import com.dental.dent_care.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final DentalServiceRepository dentalServiceRepository;
    private final EmailService emailService;

    public AppointmentResponse bookAppointment(String patientEmail, AppointmentRequest request) {
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        DentalService service = dentalServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found"));

        boolean slotTaken = appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndAppointmentTime(
                        doctor.getId(),
                        request.getAppointmentDate(),
                        request.getAppointmentTime()
                );

        if (slotTaken) {
            throw new RuntimeException("This time slot is already booked");
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        if (request.getAppointmentDate().isBefore(today)) {
            throw new RuntimeException("Cannot book an appointment on a past date");
        }

        if (request.getAppointmentDate().isEqual(today) && request.getAppointmentTime().isBefore(now)) {
            throw new RuntimeException("Cannot book an appointment on a past time slot");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .dentalService(service)
                .appointmentDate(request.getAppointmentDate())
                .appointmentTime(request.getAppointmentTime())
                .status(AppointmentStatus.PENDING)
                .notes(request.getNotes())
                .build();

        appointmentRepository.save(appointment);

        emailService.sendAppointmentConfirmation(
                patient.getEmail(),
                patient.getFullName(),
                doctor.getUser().getFullName(),
                service.getName(),
                request.getAppointmentDate().toString(),
                request.getAppointmentTime().toString()
        );

        return mapToResponse(appointment);
    }

    public List<AppointmentResponse> getPatientAppointments(String patientEmail) {
        User patient = userRepository.findByEmail(patientEmail)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return appointmentRepository.findByPatientId(patient.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getDoctorAppointments(String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        return appointmentRepository.findByDoctorId(doctor.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse updateStatus(Long appointmentId, AppointmentStatus status) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appointment.setStatus(status);
        appointmentRepository.save(appointment);

        emailService.sendStatusUpdateEmail(
                appointment.getPatient().getEmail(),
                appointment.getPatient().getFullName(),
                appointment.getDentalService().getName(),
                appointment.getAppointmentDate().toString(),
                status.name()
        );

        return mapToResponse(appointment);
    }

    public void cancelAppointment(Long appointmentId, String patientEmail) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getPatient().getEmail().equals(patientEmail)) {
            throw new RuntimeException("You are not authorized to cancel this appointment");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointmentRepository.save(appointment);

        emailService.sendStatusUpdateEmail(
                appointment.getPatient().getEmail(),
                appointment.getPatient().getFullName(),
                appointment.getDentalService().getName(),
                appointment.getAppointmentDate().toString(),
                "CANCELLED"
        );
    }

    private AppointmentResponse mapToResponse(Appointment appointment) {
        return AppointmentResponse.builder()
                .id(appointment.getId())
                .patientName(appointment.getPatient().getFullName())
                .doctorName(appointment.getDoctor().getUser().getFullName())
                .serviceName(appointment.getDentalService().getName())
                .servicePrice(appointment.getDentalService().getPrice())
                .appointmentDate(appointment.getAppointmentDate())
                .appointmentTime(appointment.getAppointmentTime())
                .status(appointment.getStatus())
                .notes(appointment.getNotes())
                .build();
    }
}