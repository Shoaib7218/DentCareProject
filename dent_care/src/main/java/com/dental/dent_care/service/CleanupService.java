package com.dental.dent_care.service;

import com.dental.dent_care.repository.OtpVerificationRepository;
import com.dental.dent_care.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CleanupService {

    private final UserRepository userRepository;
    private final OtpVerificationRepository otpVerificationRepository;

    @Scheduled(fixedRate = 60000) // every 10 minutes
    @Transactional
    public void removeStaleUnverifiedAccounts() {
        List<com.dental.dent_care.entity.User> unverifiedUsers = userRepository.findByEnabled(false);

        for (com.dental.dent_care.entity.User user : unverifiedUsers) {
            boolean hasValidOtp = otpVerificationRepository.findByEmail(user.getEmail())
                    .map(otp -> otp.getExpiryTime().isAfter(LocalDateTime.now()))
                    .orElse(false);

            if (!hasValidOtp) {
                userRepository.delete(user);
                System.out.println("Removed stale unverified account: " + user.getEmail());
            }
        }
    }
}