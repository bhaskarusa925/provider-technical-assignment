namespace Candidate.API.DTOs;

public sealed record LicenseReportResponse(
    int ProviderId,
    string ProviderName,
    string County,
    string ProviderStatus,
    int LicenseId,
    string LicenseNumber,
    string LicenseStatus,
    DateTime ExpirationDate
);