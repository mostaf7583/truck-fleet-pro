package com.truckfleetpro.backend.domain.maintenance;

import com.truckfleetpro.backend.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "maintenance_records")
@SQLDelete(sql = "UPDATE maintenance_records SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MaintenanceRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String truckId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenanceType type;

    private String description;

    @Column(nullable = false)
    private Double cost;

    @Column(nullable = false)
    private java.time.LocalDateTime date;

    private java.time.LocalDate nextDueDate;

    private String vendor;

}
