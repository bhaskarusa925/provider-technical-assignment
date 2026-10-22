using Candidate.API.Data;
using Candidate.API.DTOs;
using Candidate.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Candidate.API.Controllers;

[ApiController]
[Route("api/providers/{providerId:int}/licenses")]
public class LicensesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LicensesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLicenses(int providerId)
    {
        var providerExists = await _context.Providers
            .AnyAsync(p => p.ProviderId == providerId);

        if (!providerExists)
            return NotFound();

        var licenses = await _context.Licenses
            .AsNoTracking()
            .Where(l => l.ProviderId == providerId)
            .OrderBy(l => l.ExpirationDate)
            .ToListAsync();

        return Ok(licenses);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        int providerId,
        [FromBody] LicenseRequest request)
    {
        var providerExists = await _context.Providers
            .AnyAsync(p => p.ProviderId == providerId);

        if (!providerExists)
            return NotFound("Provider not found.");

        var licenseNumber = request.LicenseNumber.Trim();

        var duplicate = await _context.Licenses.AnyAsync(l =>
            l.ProviderId == providerId &&
            l.LicenseNumber == licenseNumber);

        if (duplicate)
            return Conflict("License number already exists.");

        var license = new ProviderLicense
        {
            ProviderId = providerId,
            LicenseNumber = licenseNumber,
            LicenseStatus = request.LicenseStatus,
            ExpirationDate = request.ExpirationDate!.Value,
            CreatedDate = DateTime.UtcNow
        };

        _context.Licenses.Add(license);
        await _context.SaveChangesAsync();

        return StatusCode(201, new
        {
            license.LicenseId,
            license.ProviderId,
            license.LicenseNumber,
            license.LicenseStatus,
            license.ExpirationDate
        });
    }
}