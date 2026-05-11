package com.logistics.dispatch.service;

import com.logistics.dispatch.entity.Dispatch;
import com.logistics.dispatch.repository.DispatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.logistics.dispatch.config.RabbitMQConfig;
import org.springframework.amqp.rabbit.annotation.RabbitListener;

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

    @RabbitListener(queues = RabbitMQConfig.QUEUE_DISPATCH)
    public void handleOrderCreated(String messagePayload) {
        try {
            Long orderId = Long.parseLong(messagePayload);
            log.info("⚡ [EVENTO RECIBIDO] OrderCreatedEvent detectado para la Orden ID: {}", orderId);
            
            // Lógica de asignación automática (Mock)
            Dispatch dispatch = Dispatch.builder()
                    .orderId(orderId)
                    .driverName("Repartidor-" + (int)(Math.random() * 100))
                    .vehiclePlate("LOG-" + (int)(Math.random() * 999))
                    .build();
                    
            Dispatch saved = assignDriverToOrder(dispatch);
            log.info("✅ [ACCIÓN COMPLETADA] Repartidor asignado automáticamente a la Orden ID: {}", saved.getOrderId());
        } catch (Exception e) {
            log.error("Error parseando mensaje a Long", e);
        }
    }

    public List<Dispatch> getAllDispatches() {
        return dispatchRepository.findAll();
    }

    public Optional<Dispatch> getDispatchByOrderId(Long orderId) {
        return dispatchRepository.findByOrderId(orderId);
    }
}
