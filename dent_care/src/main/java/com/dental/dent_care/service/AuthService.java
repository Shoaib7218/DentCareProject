package com.dental.dent_care.service;

import com.dental.dent_care.dto.AuthResponse;
import com.dental.dent_care.dto.LoginRequest;
import com.dental.dent_care.dto.RegisterRequest;
import com.dental.dent_care.dto.ResendOtpRequest;
import com.dental.dent_care.dto.UpdateProfileRequest;
import com.dental.dent_care.dto.VerifyOtpRequest;
import com.dental.dent_care.entity.OtpVerification;
import com.dental.dent_care.entity.User;
import com.dental.dent_care.enums.Role;
import com.dental.dent_care.repository.OtpVerificationRepository;
import com.dental.dent_care.repository.UserRepository;
import com.dental.dent_care.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final OtpVerificationRepository otpVerificationRepository;
    private final EmailService emailService;

    @Transactional
    public String register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(Role.PATIENT)
                .enabled(false)
                .build();

        userRepository.save(user);

        sendOtp(request.getEmail(), request.getFullName());

        return "Registration successful. OTP sent to your email for verification.";
    }


    private void sendOtp(String email, String fullName) {
        otpVerificationRepository.deleteByEmail(email);

        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpVerification otpVerification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        otpVerificationRepository.save(otpVerification);

        //emailService.sendOtpEmail(email, fullName, otp);
    }


    @Transactional
    public String sendOtp1(String email) {

        otpVerificationRepository.deleteByEmail(email);

        String otp = String.format("%06d", new Random().nextInt(999999));

        OtpVerification otpVerification = OtpVerification.builder()
                .email(email)
                .otp(otp)
                .expiryTime(LocalDateTime.now().plusMinutes(10))
                .build();

        otpVerificationRepository.save(otpVerification);

         return otp;
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        OtpVerification otpVerification = otpVerificationRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No OTP found for this email. Please register again."));

        if (otpVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            otpVerificationRepository.deleteByEmail(request.getEmail());
            throw new RuntimeException("OTP has expired. Please request a new one.");
        }

        if (!otpVerification.getOtp().equals(request.getOtp())) {
            throw new RuntimeException("Invalid OTP. Please try again.");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setEnabled(true);
        userRepository.save(user);

        otpVerificationRepository.deleteByEmail(request.getEmail());

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    @Transactional
    public String resendOtp(ResendOtpRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isEnabled()) {
            throw new RuntimeException("Account already verified. Please login.");
        }

        sendOtp(user.getEmail(), user.getFullName());

        return "OTP resent successfully to your email.";
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isEnabled()) {
            throw new RuntimeException("Account not verified. Please verify your email with the OTP sent to you.");
        }

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setFullName(request.getFullName());

        if (request.getPhone() != null && !request.getPhone().isBlank()) {
            user.setPhone(request.getPhone());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }
}