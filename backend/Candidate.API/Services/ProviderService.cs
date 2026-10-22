using Candidate.API.Data;
using Candidate.API.DTOs;
using Candidate.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Candidate.API.Services;

public class ProviderService : IProviderService
{
    private readonly ApplicationDbContext _context;

    public ProviderService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<ProviderResponse>> GetAllAsync(
        string? search,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Providers.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();

            query = query.Where(p =>
                p.ProviderName.Contains(term));
        }

        return await query
            .OrderBy(p => p.ProviderName)
            .Select(p => new ProviderResponse(
                p.ProviderId,
                p.ProviderName,
                p.County,
                p.Status,
                p.CreatedDate,
                p.UpdatedDate))
            .ToListAsync(cancellationToken);
    }
    public async Task<Provider?> GetByIdAsync(int id)
    {
        return await _context.Providers
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.ProviderId == id);
    }

    public async Task<Provider> CreateAsync(
        ProviderRequest request)
    {
        var provider = new Provider
        {
            ProviderName = request.ProviderName.Trim(),
            County = request.County.Trim(),
            Status = request.Status
        };

        _context.Providers.Add(provider);
        await _context.SaveChangesAsync();

        return provider;
    }

    public async Task<bool> UpdateAsync(
        int id,
        ProviderRequest request)
    {
        var provider = await _context.Providers
            .FirstOrDefaultAsync(p => p.ProviderId == id);

        if (provider == null)
            return false;

        provider.ProviderName = request.ProviderName.Trim();
        provider.County = request.County.Trim();
        provider.Status = request.Status;

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> SoftDeleteAsync(int id)
    {
        var provider = await _context.Providers
            .FirstOrDefaultAsync(p => p.ProviderId == id);

        if (provider == null)
            return false;

        provider.IsDeleted = true;
        provider.DeletedDate = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return true;
    }

}