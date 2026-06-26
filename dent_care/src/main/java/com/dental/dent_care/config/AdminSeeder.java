package com.dental.dent_care.config;

import com.dental.dent_care.entity.User;
import com.dental.dent_care.enums.Role;
import com.dental.dent_care.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByEmail("admin@dentcare.com").isEmpty()) {
            User admin = User.builder()
                    .fullName("Admin")
                    .email("admin@dentcare.com")
                    .password(passwordEncoder.encode("admin123"))
                    .phone("9999999999")
                    .role(Role.ADMIN)
                    .enabled(true)
                    .build();

            userRepository.save(admin);
            System.out.println("Admin account created: admin@dentcare.com / admin123");
        }
    }
}