package com.dental.dent_care.controller;

import com.dental.dent_care.dto.AppointmentRequest;
import com.dental.dent_care.dto.AppointmentResponse;
import com.dental.dent_care.dto.DentalServiceResponse;
import com.dental.dent_care.dto.DoctorResponse;
import com.dental.dent_care.service.AppointmentService;
import com.dental.dent_care.service.DentalServiceService;
import com.dental.dent_care.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import com.dental.dent_care.dto.UpdateProfileRequest;
import com.dental.dent_care.dto.AuthResponse;
import com.dental.dent_care.service.AuthService;
import com.dental.dent_care.dto.DoctorLeaveResponse;
import com.dental.dent_care.service.DoctorLeaveService;
import java.util.List;
import java.util.List;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final AppointmentService appointmentService;
    private final DentalServiceService dentalServiceService;
    private final DoctorService doctorService;

    private final AuthService authService;

    private final DoctorLeaveService doctorLeaveService;

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @GetMapping("/services")
    public ResponseEntity<List<DentalServiceResponse>> getActiveServices() {
        return ResponseEntity.ok(dentalServiceService.getActiveServices());
    }

    @PostMapping("/appointments")
    public ResponseEntity<AppointmentResponse> bookAppointment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(userDetails.getUsername(), request));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(userDetails.getUsername()));
    }

    @PutMapping("/appointments/{id}/cancel")
    public ResponseEntity<String> cancelAppointment(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        appointmentService.cancelAppointment(id, userDetails.getUsername());
        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(authService.updateProfile(userDetails.getUsername(), request));
    }

    @GetMapping("/doctors/{doctorId}/leaves")
    public ResponseEntity<List<DoctorLeaveResponse>> getDoctorLeaves(@PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorLeaveService.getLeavesByDoctorId(doctorId));
    }
}