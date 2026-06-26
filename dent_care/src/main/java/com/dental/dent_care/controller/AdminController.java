package com.dental.dent_care.controller;

import com.dental.dent_care.dto.AppointmentResponse;
import com.dental.dent_care.dto.DentalServiceRequest;
import com.dental.dent_care.dto.DentalServiceResponse;
import com.dental.dent_care.dto.DoctorRequest;
import com.dental.dent_care.dto.DoctorResponse;
import com.dental.dent_care.enums.AppointmentStatus;
import com.dental.dent_care.service.AppointmentService;
import com.dental.dent_care.service.DentalServiceService;
import com.dental.dent_care.service.DoctorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.dental.dent_care.dto.ClinicHolidayRequest;
import com.dental.dent_care.dto.ClinicHolidayResponse;
import com.dental.dent_care.service.ClinicHolidayService;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final DoctorService doctorService;
    private final DentalServiceService dentalServiceService;
    private final AppointmentService appointmentService;

    private final ClinicHolidayService clinicHolidayService;

    @PostMapping("/doctors")
    public ResponseEntity<DoctorResponse> addDoctor(@Valid @RequestBody DoctorRequest request) {
        return ResponseEntity.ok(doctorService.addDoctor(request));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<DoctorResponse>> getAllDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok("Doctor deleted successfully");
    }

    @PostMapping("/services")
    public ResponseEntity<DentalServiceResponse> addService(@Valid @RequestBody DentalServiceRequest request) {
        return ResponseEntity.ok(dentalServiceService.addService(request));
    }

    @GetMapping("/services")
    public ResponseEntity<List<DentalServiceResponse>> getAllServices() {
        return ResponseEntity.ok(dentalServiceService.getAllServices());
    }

    @PutMapping("/services/{id}")
    public ResponseEntity<DentalServiceResponse> updateService(@PathVariable Long id,
                                                               @Valid @RequestBody DentalServiceRequest request) {
        return ResponseEntity.ok(dentalServiceService.updateService(id, request));
    }

    @DeleteMapping("/services/{id}")
    public ResponseEntity<String> deleteService(@PathVariable Long id) {
        dentalServiceService.deleteService(id);
        return ResponseEntity.ok("Service deactivated successfully");
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentResponse>> getAllAppointments() {
        return ResponseEntity.ok(appointmentService.getAllAppointments());
    }

    @PutMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentResponse> updateAppointmentStatus(@PathVariable Long id,
                                                                       @RequestParam AppointmentStatus status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, status));
    }

    @PostMapping("/holidays")
    public ResponseEntity<ClinicHolidayResponse> addHoliday(
            @Valid @RequestBody ClinicHolidayRequest request) {
        return ResponseEntity.ok(clinicHolidayService.addHoliday(request));
    }

    @GetMapping("/holidays")
    public ResponseEntity<List<ClinicHolidayResponse>> getAllHolidays() {
        return ResponseEntity.ok(clinicHolidayService.getAllHolidays());
    }

    @DeleteMapping("/holidays/{id}")
    public ResponseEntity<String> deleteHoliday(@PathVariable Long id) {
        clinicHolidayService.deleteHoliday(id);
        return ResponseEntity.ok("Holiday removed successfully");
    }
}