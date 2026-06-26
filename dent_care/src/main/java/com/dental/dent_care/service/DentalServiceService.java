package com.dental.dent_care.service;

import com.dental.dent_care.dto.DentalServiceRequest;
import com.dental.dent_care.dto.DentalServiceResponse;
import com.dental.dent_care.entity.DentalService;
import com.dental.dent_care.repository.DentalServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DentalServiceService {

    private final DentalServiceRepository dentalServiceRepository;

    public DentalServiceResponse addService(DentalServiceRequest request) {
        DentalService service = DentalService.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .durationMinutes(request.getDurationMinutes())
                .active(true)
                .build();

        dentalServiceRepository.save(service);
        return mapToResponse(service);
    }

    public List<DentalServiceResponse> getAllServices() {
        return dentalServiceRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<DentalServiceResponse> getActiveServices() {
        return dentalServiceRepository.findByActiveTrue()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public DentalServiceResponse updateService(Long id, DentalServiceRequest request) {
        DentalService service = dentalServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));

        service.setName(request.getName());
        service.setDescription(request.getDescription());
        service.setPrice(request.getPrice());
        service.setDurationMinutes(request.getDurationMinutes());

        dentalServiceRepository.save(service);
        return mapToResponse(service);
    }

    public void deleteService(Long id) {
        DentalService service = dentalServiceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
        service.setActive(false);
        dentalServiceRepository.save(service);
    }

    private DentalServiceResponse mapToResponse(DentalService service) {
        return DentalServiceResponse.builder()
                .id(service.getId())
                .name(service.getName())
                .description(service.getDescription())
                .price(service.getPrice())
                .durationMinutes(service.getDurationMinutes())
                .active(service.isActive())
                .build();
    }
}