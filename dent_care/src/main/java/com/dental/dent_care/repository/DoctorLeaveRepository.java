package com.dental.dent_care.repository;

import com.dental.dent_care.entity.DoctorLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DoctorLeaveRepository extends JpaRepository<DoctorLeave, Long> {
    List<DoctorLeave> findByDoctorId(Long doctorId);
    boolean existsByDoctorIdAndLeaveDate(Long doctorId, LocalDate leaveDate);
}