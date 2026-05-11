package com.logistics.tracking.controller;

import com.logistics.tracking.dto.LocationRequestDTO;
import com.logistics.tracking.dto.LocationResponseDTO;
import com.logistics.tracking.service.TrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tracking")
@RequiredArgsConstructor
public class TrackingController {

    private final TrackingService trackingService;

    @PostMapping
    public ResponseEntity<LocationResponseDTO> saveLocation(@RequestBody LocationRequestDTO locationDTO) {
        LocationResponseDTO savedLocation = trackingService.saveLocation(locationDTO);
        return new ResponseEntity<>(savedLocation, HttpStatus.CREATED);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<LocationResponseDTO>> getTrackingHistory(@PathVariable Long orderId) {
        return ResponseEntity.ok(trackingService.getTrackingHistory(orderId));
    }
}
