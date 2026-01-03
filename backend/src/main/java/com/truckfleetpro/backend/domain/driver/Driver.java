package com.truckfleetpro.backend.domain.driver;

import com.truckfleetpro.backend.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.Date;

@Entity
@Table(name = "drivers")
@SQLDelete(sql = "UPDATE drivers SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Driver extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false, unique = true)
    private String licenseNumber;

    @Temporal(TemporalType.DATE)
    private Date licenseExpiry;

    private String phone;

    @Column(unique = true)
    private String email;

    // Aggregate Reference by ID
    private String assignedTruckId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status;

    public enum DriverStatus {
        AVAILABLE, ON_TRIP, OFF_DUTY
    }
}
8