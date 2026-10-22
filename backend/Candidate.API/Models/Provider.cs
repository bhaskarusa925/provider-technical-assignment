namespace Candidate.API.Models;

public class Provider
{
    public int ProviderId { get; set; }

    public string ProviderName { get; set; } = string.Empty;

    public string County { get; set; } = string.Empty;

    public string Status { get; set; } = "Pending";

    public DateTime CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public bool IsDeleted { get; set; }

    public DateTime? DeletedDate { get; set; }

    public ICollection<ProviderLicense> Licenses { get; set; }
        = new List<ProviderLicense>();
}