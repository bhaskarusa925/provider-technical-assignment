namespace Candidate.API.Models;

public class ProviderLicense
{
    public int LicenseId { get; set; }

    public int ProviderId { get; set; }

    public string LicenseNumber { get; set; } = string.Empty;

    public string LicenseStatus { get; set; } = "Active";

    public DateTime ExpirationDate { get; set; }

    public DateTime CreatedDate { get; set; }

    public Provider Provider { get; set; } = null!;
}