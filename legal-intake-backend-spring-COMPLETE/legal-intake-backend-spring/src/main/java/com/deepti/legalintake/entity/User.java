package com.deepti.legalintake.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

/**
 * USER ENTITY - replaces models/user.js
 *
 * In Sequelize you defined:
 *   User.init({ name, email, passwordHash, role }, { tableName: 'Users' })
 *
 * In JPA, annotations on the class do the same thing:
 *   @Entity     = this class maps to a DB table
 *   @Table      = specify the exact table name (same "Users" table your Sequelize created)
 *   @Column     = map each field to its exact column name
 *
 * Lombok annotations (all generate code at compile time, nothing in bytecode):
 *   @Data       = generates getters, setters, equals, hashCode, toString
 *   @Builder    = generates a builder pattern: User.builder().name("x").email("y").build()
 *   @NoArgsConstructor = generates empty constructor (JPA requires this)
 *   @AllArgsConstructor = generates constructor with all fields (needed by @Builder)
 */
@Entity
@Table(name = "Users")   // exact table name from your Sequelize migration
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // GenerationType.IDENTITY = auto-increment, same as your Sequelize autoIncrement: true
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    // Matches exact column name "passwordHash" from your DB
    @Column(name = "passwordHash", nullable = false)
    private String passwordHash;

    // "admin", "lawyer", "client" - same as your DataTypes.STRING role column
    @Column(nullable = false)
    private String role;

    // Hibernate automatically sets these on insert/update
    // Same as Sequelize's timestamps: true (createdAt, updatedAt)
    @CreationTimestamp
    @Column(name = "createdAt", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updatedAt")
    private LocalDateTime updatedAt;

    // ---- Associations (same as User.hasMany in Sequelize) ----
    // @OneToMany: one User can have many Cases they created
    // mappedBy = "owner" refers to the 'owner' field in the Case entity
    // cascade = if User is deleted, their created cases are too (same as onDelete: 'CASCADE')
    @JsonIgnore
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude   // Lombok: exclude from toString to prevent infinite recursion
    @EqualsAndHashCode.Exclude
    private List<Case> createdCases;

    // One User (lawyer) can have many Cases assigned to them
    @OneToMany(mappedBy = "assignedLawyer", fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<Case> assignedCases;
}