package com.logistics.dispatch.config;

import com.logistics.dispatch.dto.OrderDTO;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.support.converter.DefaultClassMapper;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE_NAME = "logistics.exchange";
    public static final String QUEUE_DISPATCH = "dispatch.queue";
    public static final String ROUTING_KEY_ORDER_CREATED = "order.created";

    @Bean
    public Queue dispatchQueue() {
        return new Queue(QUEUE_DISPATCH, true);
    }

    @Bean
    public TopicExchange logisticsExchange() {
        return new TopicExchange(EXCHANGE_NAME);
    }

    @Bean
    public Binding bindingDispatchQueue(Queue dispatchQueue, TopicExchange logisticsExchange) {
        return BindingBuilder.bind(dispatchQueue).to(logisticsExchange).with(ROUTING_KEY_ORDER_CREATED);
    }

}
