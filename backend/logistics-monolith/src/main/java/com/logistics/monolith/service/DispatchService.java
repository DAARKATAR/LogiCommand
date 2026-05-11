package com.logistics.monolith.service;

import com.logistics.monolith.entity.Dispatch;
import com.logistics.monolith.event.OrderCreatedEvent;
import com.logistics.monolith.repository.DispatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DispatchService {

    private final DispatchRepository dispatchRepository;

    public Dispatch assignDriverToOrder(Dispatch dispatch) {
        log.info("Assigning driver {} to order ID: {}", dispatch.getDriverName(), dispatch.getOrderId());
        return dispatchRepository.save(dispatch);
    }

    @Async
    @EventListener
    public void handleOrderCreatedEvent(OrderCreatedEvent event) {
        Long orderId = event.getOrderId();
        log.info("⚡ [EVENTO RECIBIDO] OrderCreatedEvent detectado localmente para la Orden ID: {}", orderId);
        
        // Lógica de asignación automática (Mock)
        Dispatch dispatch = Dispatch.builder()
                .orderId(orderId)
                .driverName("Repartidor-" + (int)(Math.random() * 100))
                .vehiclePlate("LOG-" + (int)(Math.random() * 999))
                .build();
                
        Dispatch saved = assignDriverToOrder(dispatch);
        log.info("✅ [ACCIÓN COMPLETADA] Repartidor asignado automáticamente a la Orden ID: {}", saved.getOrderId());
    }

    public List<Dispatch> getAllDispatches() {
        return dispatchRepository.findAll();
    }

    public Optional<Dispatch> getDispatchByOrderId(Long orderId) {
        return dispatchRepository.findByOrderId(orderId);
    }
}
