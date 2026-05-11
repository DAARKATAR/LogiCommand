package com.logistics.order.config;

import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "logistics.exchange";
    public static final String ROUTING_KEY_ORDER_CREATED = "order.created";

    @Bean
    public TopicExchange logisticsExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

}
