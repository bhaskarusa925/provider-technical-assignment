PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS Providers
(
    ProviderId INTEGER PRIMARY KEY AUTOINCREMENT,

    ProviderName TEXT NOT NULL
        CHECK (length(trim(ProviderName)) > 0),

    County TEXT NOT NULL
        CHECK (length(trim(County)) > 0),

    Status TEXT NOT NULL
        CHECK (Status IN ('Active', 'Inactive', 'Pending')),

    CreatedDate TEXT NOT NULL,

    UpdatedDate TEXT NULL,

    IsDeleted INTEGER NOT NULL DEFAULT 0
        CHECK (IsDeleted IN (0, 1)),

    DeletedDate TEXT NULL,

    CHECK (
        (IsDeleted = 0 AND DeletedDate IS NULL)
        OR
        (IsDeleted = 1 AND DeletedDate IS NOT NULL)
    )
);

CREATE TABLE IF NOT EXISTS Licenses
(
    LicenseId INTEGER PRIMARY KEY AUTOINCREMENT,

    ProviderId INTEGER NOT NULL,

    LicenseNumber TEXT NOT NULL
        CHECK (length(trim(LicenseNumber)) > 0),

    LicenseStatus TEXT NOT NULL
        CHECK (
            LicenseStatus IN
            ('Active', 'Expired', 'Suspended')
        ),

    ExpirationDate TEXT NOT NULL,

    CreatedDate TEXT NOT NULL,

    FOREIGN KEY (ProviderId)
        REFERENCES Providers(ProviderId)
        ON DELETE RESTRICT,

    UNIQUE (ProviderId, LicenseNumber)
);

CREATE INDEX IF NOT EXISTS IX_Providers_Name
ON Providers(ProviderName);

CREATE INDEX IF NOT EXISTS IX_Providers_Status_IsDeleted
ON Providers(Status, IsDeleted);

CREATE INDEX IF NOT EXISTS IX_Licenses_ProviderId
ON Licenses(ProviderId);

CREATE INDEX IF NOT EXISTS IX_Licenses_ExpirationDate
ON Licenses(ExpirationDate);

CREATE VIEW IF NOT EXISTS vw_ActiveProviders
AS
SELECT
    ProviderId,
    ProviderName,
    County,
    Status,
    CreatedDate,
    UpdatedDate
FROM Providers
WHERE IsDeleted = 0;

CREATE VIEW IF NOT EXISTS vw_ActiveProvidersWithActiveLicenses
AS
SELECT
    p.ProviderId,
    p.ProviderName,
    p.County,
    l.LicenseId,
    l.LicenseNumber,
    l.ExpirationDate
FROM Providers p
INNER JOIN Licenses l
    ON p.ProviderId = l.ProviderId
WHERE p.IsDeleted = 0
    AND p.Status = 'Active'
    AND l.LicenseStatus = 'Active'
    AND date(l.ExpirationDate) >= date('now');

CREATE VIEW IF NOT EXISTS vw_ActiveProvidersWithExpiredLicenses
AS
SELECT
    p.ProviderId,
    p.ProviderName,
    p.County,
    l.LicenseId,
    l.LicenseNumber,
    l.LicenseStatus,
    l.ExpirationDate
FROM Providers p
INNER JOIN Licenses l
    ON p.ProviderId = l.ProviderId
WHERE p.IsDeleted = 0
    AND p.Status = 'Active'
    AND date(l.ExpirationDate) < date('now');