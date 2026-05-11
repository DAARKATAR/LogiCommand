package com.logistics.monolith.service;

import com.logistics.monolith.entity.NotificationLog;
import com.logistics.monolith.event.OrderCreatedEvent;
import com.logistics.monolith.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationListener {

    private final NotificationRepository notificationRepository;

    @Async
    @EventListener
    public void handleOrderCreatedEvent(OrderCreatedEvent event) {
        String orderId = String.valueOf(event.getOrderId());
        log.info("🔔 [ALERTA SMS/EMAIL ENVIADA] Notificando evento a cliente para Orden ID: {}", orderId);
        
        NotificationLog notificationLog = NotificationLog.builder()
                .orderId(orderId)
                .message("Notificación de creación de orden enviada exitosamente")
                .build();
        
        notificationRepository.save(notificationLog);
        log.info("✅ [LOG GUARDADO] Registro de notificación persistido en la DB local para Orden ID: {}", orderId);
    }
}
