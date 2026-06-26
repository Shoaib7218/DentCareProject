package com.dental.dent_care.controller;

import com.dental.dent_care.dto.AuthResponse;
import com.dental.dent_care.dto.ClinicHolidayResponse;
import com.dental.dent_care.dto.LoginRequest;
import com.dental.dent_care.dto.RegisterRequest;
import com.dental.dent_care.dto.ResendOtpRequest;
import com.dental.dent_care.dto.VerifyOtpRequest;
import com.dental.dent_care.service.AuthService;
import com.dental.dent_care.service.ClinicHolidayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final ClinicHolidayService clinicHolidayService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }

    // TESTING PURPOSE ONLY


    @GetMapping("/test/get-otp")
    public String getOtp(@RequestParam String email){
        return authService.sendOtp1(email);
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(@Valid @RequestBody ResendOtpRequest request) {
        return ResponseEntity.ok(authService.resendOtp(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/holidays")
    public ResponseEntity<List<ClinicHolidayResponse>> getUpcomingHolidays() {
        return ResponseEntity.ok(clinicHolidayService.getUpcomingHolidays());
    }
}