package com.dental.dent_care.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorResponse {

    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String specialization;
    private String qualifications;
    private int experienceYears;
    private String availableDays;
    private String availableTimeStart;
    private String availableTimeEnd;
}