package com.dental.dent_care.service;

import com.dental.dent_care.dto.DoctorRequest;
import com.dental.dent_care.dto.DoctorResponse;
import com.dental.dent_care.entity.Doctor;
import com.dental.dent_care.entity.User;
import com.dental.dent_care.enums.Role;
import com.dental.dent_care.repository.DoctorRepository;
import com.dental.dent_care.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DoctorResponse addDoctor(DoctorRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.DOCTOR)
                .enabled(true)
                .build();

        userRepository.save(user);

        Doctor doctor = Doctor.builder()
                .user(user)
                .specialization(request.getSpecialization())
                .qualifications(request.getQualifications())
                .experienceYears(request.getExperienceYears())
                .availableDays(request.getAvailableDays())
                .availableTimeStart(request.getAvailableTimeStart())
                .availableTimeEnd(request.getAvailableTimeEnd())
                .build();

        doctorRepository.save(doctor);

        return mapToResponse(doctor);
    }

    public List<DoctorResponse> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return mapToResponse(doctor);
    }

    public void deleteDoctor(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctorRepository.delete(doctor);
    }

    private DoctorResponse mapToResponse(Doctor doctor) {
        return DoctorResponse.builder()
                .id(doctor.getId())
                .userId(doctor.getUser().getId())
                .fullName(doctor.getUser().getFullName())
                .email(doctor.getUser().getEmail())
                .phone(doctor.getUser().getPhone())
                .specialization(doctor.getSpecialization())
                .qualifications(doctor.getQualifications())
                .experienceYears(doctor.getExperienceYears())
                .availableDays(doctor.getAvailableDays())
                .availableTimeStart(doctor.getAvailableTimeStart())
                .availableTimeEnd(doctor.getAvailableTimeEnd())
                .build();
    }
}