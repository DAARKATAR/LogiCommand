package com.logistics.tracking.repository;

import com.logistics.tracking.entity.Location;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocationRepository extends MongoRepository<Location, String> {
    List<Location> findByOrderIdOrderByTimestampDesc(Long orderId);
}
