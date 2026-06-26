package com.dental.dent_care.service;

import com.dental.dent_care.dto.DoctorLeaveRequest;
import com.dental.dent_care.dto.DoctorLeaveResponse;
import com.dental.dent_care.entity.Doctor;
import com.dental.dent_care.entity.DoctorLeave;
import com.dental.dent_care.entity.User;
import com.dental.dent_care.repository.DoctorLeaveRepository;
import com.dental.dent_care.repository.DoctorRepository;
import com.dental.dent_care.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorLeaveService {

    private final DoctorLeaveRepository doctorLeaveRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    public DoctorLeaveResponse addLeave(String doctorEmail, DoctorLeaveRequest request) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctorLeaveRepository.existsByDoctorIdAndLeaveDate(doctor.getId(), request.getLeaveDate())) {
            throw new RuntimeException("Leave already marked for this date");
        }

        DoctorLeave leave = DoctorLeave.builder()
                .doctor(doctor)
                .leaveDate(request.getLeaveDate())
                .reason(request.getReason())
                .build();

        doctorLeaveRepository.save(leave);
        return mapToResponse(leave);
    }

    public List<DoctorLeaveResponse> getMyLeaves(String doctorEmail) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        return doctorLeaveRepository.findByDoctorId(doctor.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DoctorLeaveResponse> getLeavesByDoctorId(Long doctorId) {
        return doctorLeaveRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeLeave(String doctorEmail, Long leaveId) {
        User user = userRepository.findByEmail(doctorEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Doctor doctor = doctorRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        DoctorLeave leave = doctorLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new RuntimeException("Leave not found"));

        if (!leave.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("Not authorized to remove this leave");
        }

        doctorLeaveRepository.delete(leave);
    }

    private DoctorLeaveResponse mapToResponse(DoctorLeave leave) {
        return DoctorLeaveResponse.builder()
                .id(leave.getId())
                .leaveDate(leave.getLeaveDate())
                .reason(leave.getReason())
                .build();
    }
}