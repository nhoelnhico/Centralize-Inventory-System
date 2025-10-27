-- Run this in phpMyAdmin or MySQL console to create DB and tables
CREATE DATABASE IF NOT EXISTS asset_inventory;
USE asset_inventory;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_type VARCHAR(50),
  device_name VARCHAR(200),
  serial_number VARCHAR(200),
  fam_tag VARCHAR(100) UNIQUE,
  other_serial VARCHAR(200),
  status ENUM('available','in_use','transit','retired') DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS employee_assets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id INT NOT NULL,
  device_id INT NOT NULL,
  assigned_date DATE,
  remarks TEXT,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transmittals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trans_type ENUM('IN','OUT') NOT NULL,
  device_id INT,
  device_name VARCHAR(200),
  serial_number VARCHAR(200),
  fam_tag VARCHAR(100),
  qty INT DEFAULT 1,
  remarks TEXT,
  employee_id INT,
  signature LONGTEXT,
  trans_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

-- Seed sample data
INSERT INTO employees (employee_id, name, position, department) VALUES
  ('E001','Juan Dela Cruz','IT Support','IT'),
  ('E002','Maria Santos','Marketing Manager','Marketing');

INSERT INTO devices (device_type, device_name, serial_number, fam_tag, status) VALUES
  ('laptop','Dell XPS 13','SN12345','FAM-0001','available'),
  ('monitor','Dell 24"','SN54321','FAM-0002','available'),
  ('mobile','Samsung A52','SN98765','FAM-0003','available');
