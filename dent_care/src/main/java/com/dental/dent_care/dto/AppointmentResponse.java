package com.dental.dent_care.dto;

import com.dental.dent_care.enums.AppointmentStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
public class AppointmentResponse {

    private Long id;
    private String patientName;
    private String doctorName;
    private String serviceName;
    private Double servicePrice;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private AppointmentStatus status;
    private String notes;
}