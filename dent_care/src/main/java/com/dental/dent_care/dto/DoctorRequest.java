package com.dental.dent_care.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DoctorRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Phone is required")
    private String phone;

    @NotBlank(message = "Specialization is required")
    private String specialization;

    @NotBlank(message = "Qualifications are required")
    private String qualifications;

    @NotNull(message = "Experience years is required")
    private int experienceYears;

    @NotBlank(message = "Available days are required")
    private String availableDays;

    @NotBlank(message = "Available time start is required")
    private String availableTimeStart;

    @NotBlank(message = "Available time end is required")
    private String availableTimeEnd;
}