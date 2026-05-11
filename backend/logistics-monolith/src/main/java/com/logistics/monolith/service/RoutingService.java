package com.logistics.monolith.service;

import com.logistics.monolith.dto.RouteResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoutingService {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${osrm.url:http://localhost:5000}")
    private String osrmUrl;

    public RouteResponseDTO getRoute(double startLat, double startLng, double endLat, double endLng) {
        // OSRM espera {longitude},{latitude}
        String localUrl = String.format(java.util.Locale.ROOT, "%s/route/v1/driving/%.6f,%.6f;%.6f,%.6f?geometries=geojson&overview=full",
                osrmUrl, startLng, startLat, endLng, endLat);
        
        try {
            return requestRoute(localUrl, "Local OSRM");
        } catch (Exception e) {
            log.warn("Local OSRM not available, attempting Public Fallback API...");
            String publicUrl = String.format(java.util.Locale.ROOT, "https://router.project-osrm.org/route/v1/driving/%.6f,%.6f;%.6f,%.6f?geometries=geojson&overview=full",
                    startLng, startLat, endLng, endLat);
            try {
                return requestRoute(publicUrl, "Public OSRM");
            } catch (Exception ex) {
                log.error("All routing engines failed. Returning straight line.", ex);
            }
        }
        
        List<double[]> fallback = new ArrayList<>();
        fallback.add(new double[]{startLat, startLng});
        fallback.add(new double[]{endLat, endLng});
        
        return RouteResponseDTO.builder()
                .geometry(fallback)
                .distance(0)
                .duration(0)
                .build();
    }

    private RouteResponseDTO requestRoute(String url, String sourceName) throws Exception {
        log.info("Requesting route from {}: {}", sourceName, url);
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        JsonNode root = objectMapper.readTree(response.getBody());
        
        if (root.has("routes") && root.get("routes").isArray() && root.get("routes").size() > 0) {
            JsonNode route = root.get("routes").get(0);
            JsonNode coordinates = route.get("geometry").get("coordinates");
            
            List<double[]> geometryList = new ArrayList<>();
            for (JsonNode coord : coordinates) {
                geometryList.add(new double[]{coord.get(1).asDouble(), coord.get(0).asDouble()});
            }
            
            return RouteResponseDTO.builder()
                    .geometry(geometryList)
                    .distance(route.get("distance").asDouble())
                    .duration(route.get("duration").asDouble())
                    .build();
        }
        throw new RuntimeException("Empty response from " + sourceName);
    }
}
