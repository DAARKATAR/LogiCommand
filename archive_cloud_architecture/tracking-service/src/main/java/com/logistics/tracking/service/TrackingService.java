package com.logistics.tracking.service;

import com.logistics.tracking.dto.LocationRequestDTO;
import com.logistics.tracking.dto.LocationResponseDTO;
import com.logistics.tracking.entity.Location;
import com.logistics.tracking.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrackingService {

    private final LocationRepository locationRepository;

    public LocationResponseDTO saveLocation(LocationRequestDTO requestDTO) {
        log.info("Saving new location for order ID: {}", requestDTO.getOrderId());
        
        Location location = Location.builder()
                .orderId(requestDTO.getOrderId())
                .latitude(requestDTO.getLatitude())
                .longitude(requestDTO.getLongitude())
                .timestamp(LocalDateTime.now())
                .build();
        
        Location saved = locationRepository.save(location);
        return mapToResponseDTO(saved);
    }

    public List<LocationResponseDTO> getTrackingHistory(Long orderId) {
        log.info("Fetching tracking history for order ID: {}", orderId);
        return locationRepository.findByOrderIdOrderByTimestampDesc(orderId)
                .stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    private LocationResponseDTO mapToResponseDTO(Location location) {
        return LocationResponseDTO.builder()
                .id(location.getId())
                .orderId(location.getOrderId())
                .latitude(location.getLatitude())
                .longitude(location.getLongitude())
                .timestamp(location.getTimestamp())
                .build();
    }
}
