package com.truckfleetpro.backend.domain.trip;

import com.truckfleetpro.backend.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "trips")
@SQLDelete(sql = "UPDATE trips SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trip extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String origin;

    @Column(nullable = false)
    private String destination;

    private java.time.LocalDateTime startDate;

    private java.time.LocalDateTime endDate;

    private String driverId;
    private String truckId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status;

    private Double distance;
    private String clientName;

}
