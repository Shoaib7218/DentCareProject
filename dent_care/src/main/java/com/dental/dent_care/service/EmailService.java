package com.dental.dent_care.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;


import jakarta.mail.internet.MimeMessage;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendAppointmentConfirmation(String toEmail, String patientName,
                                            String doctorName, String serviceName,
                                            String date, String time) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Appointment Booked - DentCare");
            helper.setText(buildBookingEmail(patientName, doctorName, serviceName, date, time), true);

            mailSender.send (message);
        } catch (Exception e) {
            System.out.println("Failed to send booking email: " + e.getMessage());
        }
    }

    public void sendStatusUpdateEmail(String toEmail, String patientName,
                                      String serviceName, String date,
                                      String status) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Appointment Update - DentCare");
            helper.setText(buildStatusEmail(patientName, serviceName, date, status), true);

            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Failed to send status email: " + e.getMessage());
        }
    }

    private String buildBookingEmail(String patientName, String doctorName,
                                     String serviceName, String date, String time) {
        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>"
                + "<div style='background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>"
                + "<h1 style='color: white; margin: 0;'>🦷 DentCare</h1>"
                + "<p style='color: rgba(255,255,255,0.9); margin-top: 8px;'>Your Smile, Our Priority</p>"
                + "</div>"
                + "<div style='background: #ffffff; padding: 30px; border: 1px solid #e2e8f0;'>"
                + "<h2 style='color: #2d3748;'>Appointment Confirmed ✅</h2>"
                + "<p style='color: #718096;'>Dear <strong>" + patientName + "</strong>,</p>"
                + "<p style='color: #718096;'>Your appointment has been successfully booked. Here are your details:</p>"
                + "<div style='background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;'>"
                + "<p><strong>Doctor:</strong> " + doctorName + "</p>"
                + "<p><strong>Service:</strong> " + serviceName + "</p>"
                + "<p><strong>Date:</strong> " + date + "</p>"
                + "<p><strong>Time:</strong> " + time + "</p>"
                + "</div>"
                + "<p style='color: #718096;'>Please arrive 10 minutes before your appointment.</p>"
                + "<p style='color: #718096;'>Thank you for choosing DentCare.</p>"
                + "</div>"
                + "<div style='background: #f7fafc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;'>"
                + "<p style='color: #a0aec0; font-size: 12px;'>© 2025 DentCare. All rights reserved.</p>"
                + "</div>"
                + "</div>";
    }

    private String buildStatusEmail(String patientName, String serviceName,
                                    String date, String status) {
        String statusMessage = switch (status) {
            case "CONFIRMED" -> "Your appointment has been confirmed by the clinic.";
            case "COMPLETED" -> "Your appointment has been marked as completed. Thank you for visiting!";
            case "CANCELLED" -> "Your appointment has been cancelled. Please contact us to reschedule.";
            default -> "Your appointment status has been updated.";
        };

        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>"
                + "<div style='background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>"
                + "<h1 style='color: white; margin: 0;'>🦷 DentCare</h1>"
                + "<p style='color: rgba(255,255,255,0.9); margin-top: 8px;'>Your Smile, Our Priority</p>"
                + "</div>"
                + "<div style='background: #ffffff; padding: 30px; border: 1px solid #e2e8f0;'>"
                + "<h2 style='color: #2d3748;'>Appointment Update 📋</h2>"
                + "<p style='color: #718096;'>Dear <strong>" + patientName + "</strong>,</p>"
                + "<p style='color: #718096;'>" + statusMessage + "</p>"
                + "<div style='background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0;'>"
                + "<p><strong>Service:</strong> " + serviceName + "</p>"
                + "<p><strong>Date:</strong> " + date + "</p>"
                + "<p><strong>Status:</strong> " + status + "</p>"
                + "</div>"
                + "<p style='color: #718096;'>Thank you for choosing DentCare.</p>"
                + "</div>"
                + "<div style='background: #f7fafc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;'>"
                + "<p style='color: #a0aec0; font-size: 12px;'>© 2025 DentCare. All rights reserved.</p>"
                + "</div>"
                + "</div>";
    }

    public void sendOtpEmail(String toEmail, String fullName, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Verify Your Email - DentCare");
            helper.setText(buildOtpEmail(fullName, otp), true);

            mailSender.send(message);
        } catch (Exception e) {
            System.out.println("Failed to send OTP email: " + e.getMessage());
        }
    }

    private String buildOtpEmail(String fullName, String otp) {
        return "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>"
                + "<div style='background: linear-gradient(135deg, #667eea, #764ba2); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>"
                + "<h1 style='color: white; margin: 0;'>🦷 DentCare</h1>"
                + "<p style='color: rgba(255,255,255,0.9); margin-top: 8px;'>Your Smile, Our Priority</p>"
                + "</div>"
                + "<div style='background: #ffffff; padding: 30px; border: 1px solid #e2e8f0;'>"
                + "<h2 style='color: #2d3748;'>Verify Your Email Address</h2>"
                + "<p style='color: #718096;'>Dear <strong>" + fullName + "</strong>,</p>"
                + "<p style='color: #718096;'>Thank you for registering with DentCare. Please use the OTP below to verify your email address.</p>"
                + "<div style='background: #f7fafc; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;'>"
                + "<p style='font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #667eea; margin: 0;'>" + otp + "</p>"
                + "</div>"
                + "<p style='color: #718096;'>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>"
                + "</div>"
                + "<div style='background: #f7fafc; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border: 1px solid #e2e8f0;'>"
                + "<p style='color: #a0aec0; font-size: 12px;'>© 2026 DentCare. All rights reserved.</p>"
                + "</div>"
                + "</div>";
    }
}