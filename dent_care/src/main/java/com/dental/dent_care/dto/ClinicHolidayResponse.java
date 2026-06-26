package com.dental.dent_care.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ClinicHolidayResponse {

    private Long id;
    private LocalDate holidayDate;
    private String reason;
}