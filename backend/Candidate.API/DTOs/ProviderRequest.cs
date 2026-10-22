using System.ComponentModel.DataAnnotations;

namespace Candidate.API.DTOs;

public class ProviderRequest
{
    [Required]
    [StringLength(200, MinimumLength = 2)]
    public string ProviderName { get; set; } = "";

    [Required]
    [StringLength(100, MinimumLength = 2)]
    public string County { get; set; } = "";

    [Required]
    [RegularExpression(
        "^(Active|Inactive|Pending)$",
        ErrorMessage = "Invalid provider status.")]
    public string Status { get; set; } = "Pending";
}