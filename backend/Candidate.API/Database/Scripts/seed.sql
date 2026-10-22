PRAGMA foreign_keys = ON;

INSERT INTO Providers
(
    ProviderName,
    County,
    Status,
    CreatedDate
)
VALUES
('North Care Center', 'Fulton', 'Active', datetime('now')),
('South Health Services', 'DeKalb', 'Active', datetime('now')),
('Community Wellness', 'Cobb', 'Pending', datetime('now')),
('Inactive Medical Group', 'Gwinnett', 'Inactive', datetime('now'));

INSERT INTO Licenses
(
    ProviderId,
    LicenseNumber,
    LicenseStatus,
    ExpirationDate,
    CreatedDate
)
SELECT
    ProviderId,
    'LIC-1001',
    'Active',
    '2027-12-31',
    datetime('now')
FROM Providers
WHERE ProviderName = 'North Care Center';

INSERT INTO Licenses
(
    ProviderId,
    LicenseNumber,
    LicenseStatus,
    ExpirationDate,
    CreatedDate
)
SELECT
    ProviderId,
    'LIC-1002',
    'Active',
    '2025-12-31',
    datetime('now')
FROM Providers
WHERE ProviderName = 'South Health Services';