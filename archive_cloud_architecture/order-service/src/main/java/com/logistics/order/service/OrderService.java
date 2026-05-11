package com.logistics.order.service;

import com.logistics.order.dto.OrderRequestDTO;
import com.logistics.order.dto.OrderResponseDTO;
import com.logistics.order.entity.Order;
import com.logistics.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.logistics.order.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.core.RabbitTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final RabbitTemplate rabbitTemplate;

    public OrderResponseDTO createOrder(OrderRequestDTO orderDTO) {
        log.info("Creating new order for customer: {}", orderDTO.getCustomerName());
        
        Order order = Order.builder()
                .customerName(orderDTO.getCustomerName())
                .originAddress(orderDTO.getOriginAddress())
                .destinationAddress(orderDTO.getDestinationAddress())
                .originLat(orderDTO.getOriginLat())
                .originLng(orderDTO.getOriginLng())
                .destinationLat(orderDTO.getDestinationLat())
                .destinationLng(orderDTO.getDestinationLng())
                .packageDescription(orderDTO.getPackageDescription())
                .status(orderDTO.getStatus())
                .build();

        Order savedOrder = orderRepository.save(order);
        
        log.info("Order created with ID: {}. Publishing to RabbitMQ...", savedOrder.getId());
        try {
            String message = String.valueOf(savedOrder.getId());
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY_ORDER_CREATED, message);
        } catch (Exception e) {
            log.error("Error enviando mensaje", e);
        }
        
        return mapToResponseDTO(savedOrder);
    }

    public List<OrderResponseDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    public Optional<OrderResponseDTO> getOrderById(Long id) {
        return orderRepository.findById(id).map(this::mapToResponseDTO);
    }

    public OrderResponseDTO updateOrder(Long id, OrderRequestDTO orderDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id " + id));
        
        order.setCustomerName(orderDTO.getCustomerName());
        order.setOriginAddress(orderDTO.getOriginAddress());
        order.setDestinationAddress(orderDTO.getDestinationAddress());
        order.setOriginLat(orderDTO.getOriginLat());
        order.setOriginLng(orderDTO.getOriginLng());
        order.setDestinationLat(orderDTO.getDestinationLat());
        order.setDestinationLng(orderDTO.getDestinationLng());
        order.setPackageDescription(orderDTO.getPackageDescription());
        if (orderDTO.getStatus() != null) {
            order.setStatus(orderDTO.getStatus());
        }
        
        Order updatedOrder = orderRepository.save(order);
        return mapToResponseDTO(updatedOrder);
    }

    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id " + id));
        orderRepository.delete(order);
    }

    private OrderResponseDTO mapToResponseDTO(Order order) {
        return OrderResponseDTO.builder()
                .id(order.getId())
                .customerName(order.getCustomerName())
                .originAddress(order.getOriginAddress())
                .destinationAddress(order.getDestinationAddress())
                .originLat(order.getOriginLat())
                .originLng(order.getOriginLng())
                .destinationLat(order.getDestinationLat())
                .destinationLng(order.getDestinationLng())
                .packageDescription(order.getPackageDescription())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
