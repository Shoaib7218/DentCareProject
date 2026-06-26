package com.dental.dent_care.repository;

import com.dental.dent_care.entity.ClinicHoliday;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ClinicHolidayRepository extends JpaRepository<ClinicHoliday, Long> {
    boolean existsByHolidayDate(LocalDate holidayDate);
    List<ClinicHoliday> findAllByOrderByHolidayDateAsc();
    List<ClinicHoliday> findByHolidayDateGreaterThanEqualOrderByHolidayDateAsc(LocalDate date);
}