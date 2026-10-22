namespace Candidate.API.DTOs;

public sealed record LicenseResponse(
    int LicenseId,
    int ProviderId,
    string LicenseNumber,
    string LicenseStatus,
    DateTime ExpirationDate,
    bool IsExpired
);