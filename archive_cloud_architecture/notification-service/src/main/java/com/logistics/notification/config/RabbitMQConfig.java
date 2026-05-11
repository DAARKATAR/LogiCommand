package com.logistics.notification.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "logistics.exchange";
    public static final String QUEUE_NOTIFICATION = "notification.queue";
    // Escucha cualquier evento relacionado con órdenes (creación, actualización, etc.)
    public static final String ROUTING_KEY_PATTERN = "order.*";

    @Bean
    public Queue notificationQueue() {
        return new Queue(QUEUE_NOTIFICATION, true);
    }

    @Bean
    public TopicExchange logisticsExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding bindingNotificationQueue(Queue notificationQueue, TopicExchange logisticsExchange) {
        return BindingBuilder.bind(notificationQueue).to(logisticsExchange).with(ROUTING_KEY_PATTERN);
    }
}
