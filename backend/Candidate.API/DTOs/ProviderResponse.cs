namespace Candidate.API.DTOs;

public sealed record ProviderResponse(
    int ProviderId,
    string ProviderName,
    string County,
    string Status,
    DateTime CreatedDate,
    DateTime? UpdatedDate
);