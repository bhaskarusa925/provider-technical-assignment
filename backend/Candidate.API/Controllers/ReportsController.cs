using Candidate.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Candidate.API.Controllers;

[ApiController]
[Route("api/reports")]
public class ReportsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportsController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("active-providers-active-licenses")]
    public async Task<IActionResult> ActiveProvidersActiveLicenses()
    {
        var today = DateTime.UtcNow.Date;

        var records = await _context.Licenses
            .AsNoTracking()
            .Where(l =>
                l.Provider.Status == "Active" &&
                l.LicenseStatus == "Active" &&
                l.ExpirationDate.Date >= today)
            .Select(l => new
            {
                l.ProviderId,
                l.Provider.ProviderName,
                l.Provider.County,
                l.LicenseId,
                l.LicenseNumber,
                l.ExpirationDate
            })
            .ToListAsync();

        return Ok(records);
    }

    [HttpGet("active-providers-expired-licenses")]
    public async Task<IActionResult> ActiveProvidersExpiredLicenses()
    {
        var today = DateTime.UtcNow.Date;

        var records = await _context.Licenses
            .AsNoTracking()
            .Where(l =>
                l.Provider.Status == "Active" &&
                l.ExpirationDate.Date < today)
            .Select(l => new
            {
                l.ProviderId,
                l.Provider.ProviderName,
                l.Provider.County,
                l.LicenseId,
                l.LicenseNumber,
                l.LicenseStatus,
                l.ExpirationDate
            })
            .ToListAsync();

        return Ok(records);
    }
}