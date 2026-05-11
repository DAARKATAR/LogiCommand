package com.logistics.notification.service;

import com.logistics.notification.config.RabbitMQConfig;
import com.logistics.notification.entity.NotificationLog;
import com.logistics.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationListener {

    private final NotificationRepository notificationRepository;

    @RabbitListener(queues = RabbitMQConfig.QUEUE_NOTIFICATION)
    public void handleNotification(String orderId) {
        log.info("🔔 [ALERTA SMS/EMAIL ENVIADA] Notificando evento a cliente para Orden ID: {}", orderId);
        
        NotificationLog notificationLog = NotificationLog.builder()
                .orderId(orderId)
                .message("Notificación de creación de orden enviada exitosamente")
                .build();
        
        notificationRepository.save(notificationLog);
        log.info("✅ [LOG GUARDADO] Registro de notificación persistido en la DB para Orden ID: {}", orderId);
    }
}
