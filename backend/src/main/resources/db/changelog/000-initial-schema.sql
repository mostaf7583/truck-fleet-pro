-- liquibase formatted sql

-- changeset mostafa:0
-- Comment: Initial Schema Creation

CREATE TABLE trucks (
    id VARCHAR(255) PRIMARY KEY,
    plate_number VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    model_year INT NOT NULL,
    capacity DOUBLE PRECISION NOT NULL,
    mileage DOUBLE PRECISION NOT NULL,
    status VARCHAR(50) NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE drivers (
    id VARCHAR(255) PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(255) NOT NULL,
    license_expiry DATE NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    assigned_truck_id VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE trips (
    id VARCHAR(255) PRIMARY KEY,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    driver_id VARCHAR(255),
    truck_id VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    distance DOUBLE PRECISION,
    client_name VARCHAR(255),
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE fuel_records (
    id VARCHAR(255) PRIMARY KEY,
    truck_id VARCHAR(255) NOT NULL,
    trip_id VARCHAR(255),
    date TIMESTAMP NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    cost DOUBLE PRECISION NOT NULL,
    station VARCHAR(255),
    odometer_reading DOUBLE PRECISION,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE maintenance_records (
    id VARCHAR(255) PRIMARY KEY,
    truck_id VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    cost DOUBLE PRECISION NOT NULL,
    vendor VARCHAR(255),
    next_due_date TIMESTAMP,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE trip_incomes (
    id VARCHAR(255) PRIMARY KEY,
    trip_id VARCHAR(255) NOT NULL,
    client_name VARCHAR(255),
    amount DOUBLE PRECISION NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    due_date DATE,
    paid_date DATE,
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE trip_expenses (
    id VARCHAR(255) PRIMARY KEY,
    trip_id VARCHAR(255) NOT NULL,
    amount DOUBLE PRECISION NOT NULL,
    date TIMESTAMP NOT NULL,
    description TEXT,
    type VARCHAR(50),
    deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
