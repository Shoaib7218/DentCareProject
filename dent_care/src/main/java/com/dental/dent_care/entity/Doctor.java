package com.dental.dent_care.entity;



import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private String qualifications;

    @Column(nullable = false)
    private int experienceYears;

    @Column(nullable = false)
    private String availableDays;

    @Column(nullable = false)
    private String availableTimeStart;

    @Column(nullable = false)
    private String availableTimeEnd;
}