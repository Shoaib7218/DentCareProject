package com.dental.dent_care.controller;

import com.dental.dent_care.dto.AppointmentResponse;
import com.dental.dent_care.dto.DoctorLeaveRequest;
import com.dental.dent_care.dto.DoctorLeaveResponse;
import com.dental.dent_care.service.AppointmentService;
import com.dental.dent_care.service.DoctorLeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final AppointmentService appointmentService;
    private final DoctorLeaveService doctorLeaveService;

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getMyAppointments(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(userDetails.getUsername()));
    }

    @PostMapping("/leaves")
    public ResponseEntity<DoctorLeaveResponse> addLeave(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody DoctorLeaveRequest request) {
        return ResponseEntity.ok(doctorLeaveService.addLeave(userDetails.getUsername(), request));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<DoctorLeaveResponse>> getMyLeaves(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(doctorLeaveService.getMyLeaves(userDetails.getUsername()));
    }

    @DeleteMapping("/leaves/{id}")
    public ResponseEntity<String> removeLeave(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        doctorLeaveService.removeLeave(userDetails.getUsername(), id);
        return ResponseEntity.ok("Leave removed successfully");
    }

    @GetMapping("/leaves/doctor/{doctorId}")
    public ResponseEntity<List<DoctorLeaveResponse>> getLeavesByDoctorId(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(doctorLeaveService.getLeavesByDoctorId(doctorId));
    }
}