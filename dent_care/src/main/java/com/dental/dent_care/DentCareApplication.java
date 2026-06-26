package com.dental.dent_care;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DentCareApplication {

	public static void main(String[] args) {
		SpringApplication.run(DentCareApplication.class, args);
	}

}
