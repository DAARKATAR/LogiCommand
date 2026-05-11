package com.logistics.tracking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationResponseDTO {
    private String id;
    private Long orderId;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
}
