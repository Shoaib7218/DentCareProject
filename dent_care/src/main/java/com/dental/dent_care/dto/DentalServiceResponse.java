package com.dental.dent_care.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DentalServiceResponse {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private int durationMinutes;
    private boolean active;
}