package com.truckfleetpro.backend.domain.fuel;

import com.truckfleetpro.backend.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.Date;

@Entity
@Table(name = "fuel_records")
@SQLDelete(sql = "UPDATE fuel_records SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FuelRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String truckId;

    private String tripId;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private Double cost;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date date;

    private String station;
    private Double odometerReading;
}
