package com.logistics.dispatch.dto;

import lombok.Data;

@Data
public class OrderDTO {
    private Long id;
    private String customerName;
    private String destinationAddress;
    private String status;
}
