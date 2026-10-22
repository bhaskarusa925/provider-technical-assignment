using System.ComponentModel.DataAnnotations;

namespace Candidate.API.DTOs;

public class LicenseRequest
{
    [Required]
    [StringLength(100)]
    public string LicenseNumber { get; set; } = string.Empty;

    [Required]
    [RegularExpression("^(Active|Expired|Suspended)$")]
    public string LicenseStatus { get; set; } = "Active";

    [Required]
    public DateTime? ExpirationDate { get; set; }
}