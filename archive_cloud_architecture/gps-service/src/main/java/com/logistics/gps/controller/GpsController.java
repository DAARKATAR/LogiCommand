package com.logistics.gps.controller;

import com.logistics.gps.dto.RouteResponseDTO;
import com.logistics.gps.service.RoutingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/gps")
@RequiredArgsConstructor
public class GpsController {

    private final RoutingService routingService;

    @GetMapping("/route")
    public ResponseEntity<RouteResponseDTO> getRoute(
            @RequestParam double originLat,
            @RequestParam double originLng,
            @RequestParam double destLat,
            @RequestParam double destLng) {
        
        return ResponseEntity.ok(routingService.getRoute(originLat, originLng, destLat, destLng));
    }
}
