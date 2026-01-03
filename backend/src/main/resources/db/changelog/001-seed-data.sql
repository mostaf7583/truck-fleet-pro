-- liquibase formatted sql

-- changeset mostafa:1
-- Comment: Seed initial data for Trucks
INSERT INTO trucks (id, plate_number, model, model_year, capacity, mileage, status, deleted, created_at, updated_at)
VALUES
    ('t1', 'ABC-1234', 'Volvo FH16', 2023, 25000, 15000.5, 'ACTIVE' , false, NOW(), NOW()),
    ('t2', 'XYZ-9876', 'Mercedes Actros', 2022, 26000, 45000.2, 'MAINTENANCE', false, NOW(), NOW()),
    ('t3', 'DEF-5678', 'Scania R500', 2024, 28000, 5000.0, 'ACTIVE', false, NOW(), NOW()),
    ('t4', 'LMN-4321', 'MAN TGX', 2021, 24000, 85000.8, 'ACTIVE', false, NOW(), NOW()),
    ('t5', 'OPQ-1357', 'Renault T', 2020, 22000, 120000.0, 'INACTIVE', false, NOW(), NOW()),
    ('t6', 'RST-2468', 'DAF XF', 2023, 27000, 20000.0, 'ACTIVE', false, NOW(), NOW()),
    ('t7', 'UVW-9753', 'Iveco S-Way', 2022, 25000, 35000.0, 'ACTIVE', false, NOW(), NOW()),
    ('t8', 'GHI-8642', 'Volvo FM', 2021, 23000, 60000.0, 'MAINTENANCE', false, NOW(), NOW()),
    ('t9', 'JKL-7531', 'Mercedes Arocs', 2024, 30000, 2000.0, 'ACTIVE', false, NOW(), NOW()),
    ('t10', 'MNO-1593', 'Scania P', 2020, 18000, 95000.0, 'ACTIVE', false, NOW(), NOW());

-- changeset mostafa:2
-- Comment: Seed initial data for Drivers
INSERT INTO drivers (id, first_name, last_name, license_number, license_expiry, phone, email, status, assigned_truck_id, deleted, created_at, updated_at)
VALUES
    ('d1', 'Ahmed', 'Ali', 'DL-1001', '2026-05-15', '+966-50-111-2222', 'ahmed.ali@example.com', 'AVAILABLE', NULL, false, NOW(), NOW()),
    ('d2', 'Mohammed', 'Hassan', 'DL-1002', '2025-11-20', '+966-50-333-4444', 'mohammed.h@example.com', 'ON_TRIP', 't1', false, NOW(), NOW()),
    ('d3', 'Khalid', 'Ibrahim', 'DL-1003', '2027-01-10', '+966-50-555-6666', 'khalid.i@example.com', 'OFF_DUTY', NULL, false, NOW(), NOW()),
    ('d4', 'Omar', 'Saeed', 'DL-1004', '2026-08-30', '+966-50-777-8888', 'omar.s@example.com', 'AVAILABLE', NULL, false, NOW(), NOW()),
    ('d5', 'Youssef', 'Nasser', 'DL-1005', '2025-06-01', '+966-50-999-0000', 'youssef.n@example.com', 'ON_TRIP', 't3', false, NOW(), NOW());

-- changeset mostafa:3
-- Comment: Seed initial data for Trips
INSERT INTO trips (id, origin, destination, start_date, end_date, driver_id, truck_id, status, distance, client_name, deleted, created_at, updated_at)
VALUES
    ('tr1', 'Riyadh', 'Jeddah', NOW() - INTERVAL '2 days', NULL, 'd2', 't1', 'IN_PROGRESS', 950.0, 'Almarai', false, NOW(), NOW()),
    ('tr2', 'Dammam', 'Riyadh', NOW() - INTERVAL '5 days', NOW() - INTERVAL '4 days', 'd5', 't3', 'COMPLETED', 400.0, 'Sabic', false, NOW(), NOW()),
    ('tr3', 'Jeddah', 'Mecca', NOW() - INTERVAL '1 day', NULL, 'd2', 't1', 'SCHEDULED', 80.0, 'Binladin Group', false, NOW(), NOW());

-- changeset mostafa:4
-- Comment: Seed initial data for Fuel Records
INSERT INTO fuel_records (id, truck_id, trip_id, date, amount, cost, station, odometer_reading, deleted, created_at, updated_at)
VALUES
    ('fr1', 't1', 'tr1', NOW() - INTERVAL '2 days', 500.0, 1500.0, 'Sasco Riyadh', 15500.0, false, NOW(), NOW()),
    ('fr2', 't3', 'tr2', NOW() - INTERVAL '5 days', 300.0, 900.0, 'Adnoc Dammam', 5300.0, false, NOW(), NOW());

-- changeset mostafa:5
-- Comment: Seed initial data for Maintenance Records
INSERT INTO maintenance_records (id, truck_id, date, type, description, cost, vendor, next_due_date, deleted, created_at, updated_at)
VALUES
    ('mr1', 't2', NOW() - INTERVAL '10 days', 'PREVENTIVE', 'Oil Change', 500.0, 'Petromin', NOW() + INTERVAL '3 months', false, NOW(), NOW()),
    ('mr2', 't8', NOW() - INTERVAL '2 days', 'CORRECTIVE', 'Brake Pad Replacement', 1200.0, 'Official Dealer', NOW() + INTERVAL '1 year', false, NOW(), NOW());

-- changeset mostafa:6
-- Comment: Seed initial data for Trip Incomes
INSERT INTO trip_incomes (id, trip_id, client_name, amount, payment_status, due_date, paid_date, deleted, created_at, updated_at)
VALUES
    ('ti1', 'tr1', 'Almarai', 2500.0, 'PAID', '2025-12-01', '2025-12-05', false, NOW(), NOW());
