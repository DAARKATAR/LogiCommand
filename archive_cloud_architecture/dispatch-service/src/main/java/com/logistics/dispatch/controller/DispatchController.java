package com.logistics.dispatch.controller;

import com.logistics.dispatch.entity.Dispatch;
import com.logistics.dispatch.service.DispatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dispatch")
@RequiredArgsConstructor
public class DispatchController {

    private final DispatchService dispatchService;

    @PostMapping
    public ResponseEntity<Dispatch> createDispatch(@RequestBody Dispatch dispatch) {
        Dispatch newDispatch = dispatchService.assignDriverToOrder(dispatch);
        return new ResponseEntity<>(newDispatch, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Dispatch>> getAllDispatches() {
        return ResponseEntity.ok(dispatchService.getAllDispatches());
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Dispatch> getDispatchByOrderId(@PathVariable Long orderId) {
        return dispatchService.getDispatchByOrderId(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
