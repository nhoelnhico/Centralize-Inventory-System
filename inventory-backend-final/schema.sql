-- Database schema for asset_inventory
CREATE DATABASE IF NOT EXISTS asset_inventory;
USE asset_inventory;

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(200) NOT NULL,
  position VARCHAR(100),
  department VARCHAR(100),
  date_hired DATE,
  email VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS devices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  device_type VARCHAR(50),
  brand VARCHAR(100),
  model VARCHAR(200),
  device_name VARCHAR(200),
  serial_number VARCHAR(200),
  fam_tag VARCHAR(100) UNIQUE,
  remarks TEXT,
  status ENUM('available','in_use','returned','disposed') DEFAULT 'available',
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
  transmittal_no VARCHAR(50),
  employee_id INT,
  trans_type ENUM('IN','OUT') NOT NULL,
  date_trans DATE,
  remarks TEXT,
  signature TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS transmittal_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  transmittal_id INT NOT NULL,
  device_id INT NOT NULL,
  status ENUM('issued','returned') DEFAULT 'issued',
  FOREIGN KEY (transmittal_id) REFERENCES transmittals(id) ON DELETE CASCADE,
  FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE SET NULL
);

-- sample data
INSERT IGNORE INTO employees (employee_id,name,position,department,date_hired,email) VALUES
('E001','Juan Dela Cruz','IT Support','IT','2020-01-15','juan@example.com'),
('E002','Maria Santos','Marketing Manager','Marketing','2019-06-01','maria@example.com');

INSERT IGNORE INTO devices (device_type,brand,model,device_name,serial_number,fam_tag,status) VALUES
('laptop','Dell','XPS 13','Dell XPS 13','SN12345','FAM-0001','available'),
('phone','Samsung','A52','Samsung A52','SN98765','FAM-0003','available');
