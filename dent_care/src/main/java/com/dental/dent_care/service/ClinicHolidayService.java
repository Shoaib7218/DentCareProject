package com.dental.dent_care.service;

import com.dental.dent_care.dto.ClinicHolidayRequest;
import com.dental.dent_care.dto.ClinicHolidayResponse;
import com.dental.dent_care.entity.ClinicHoliday;
import com.dental.dent_care.repository.ClinicHolidayRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClinicHolidayService {

    private final ClinicHolidayRepository clinicHolidayRepository;

    public ClinicHolidayResponse addHoliday(ClinicHolidayRequest request) {
        if (clinicHolidayRepository.existsByHolidayDate(request.getHolidayDate())) {
            throw new RuntimeException("Holiday already marked for this date");
        }

        ClinicHoliday holiday = ClinicHoliday.builder()
                .holidayDate(request.getHolidayDate())
                .reason(request.getReason())
                .build();

        clinicHolidayRepository.save(holiday);
        return mapToResponse(holiday);
    }

    public List<ClinicHolidayResponse> getAllHolidays() {
        return clinicHolidayRepository.findAllByOrderByHolidayDateAsc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ClinicHolidayResponse> getUpcomingHolidays() {
        return clinicHolidayRepository
                .findByHolidayDateGreaterThanEqualOrderByHolidayDateAsc(LocalDate.now())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public void deleteHoliday(Long id) {
        ClinicHoliday holiday = clinicHolidayRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Holiday not found"));
        clinicHolidayRepository.delete(holiday);
    }

    private ClinicHolidayResponse mapToResponse(ClinicHoliday holiday) {
        return ClinicHolidayResponse.builder()
                .id(holiday.getId())
                .holidayDate(holiday.getHolidayDate())
                .reason(holiday.getReason())
                .build();
    }
}