package com.truckfleetpro.backend.domain.financial;

import com.truckfleetpro.backend.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "trip_expenses")
@SQLDelete(sql = "UPDATE trip_expenses SET deleted = true WHERE id=?")
@SQLRestriction("deleted = false")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TripExpense extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String tripId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ExpenseType type;

    private String description;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private java.time.LocalDateTime date;

}
