package com.truckfleetpro.backend.domain.driver;

import com.truckfleetpro.backend.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

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

    private java.time.LocalDate licenseExpiry;

    private String phone;

    @Column(unique = true)
    private String email;

    // Aggregate Reference by ID
    private String assignedTruckId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status;

}
