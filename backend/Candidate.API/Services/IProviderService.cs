using Candidate.API.DTOs;
using Candidate.API.Models;

namespace Candidate.API.Services;

public interface IProviderService
{
    Task<List<ProviderResponse>> GetAllAsync(string? search,
        CancellationToken cancellationToken);

    Task<Provider?> GetByIdAsync(int id);

    Task<Provider> CreateAsync(ProviderRequest request);

    Task<bool> UpdateAsync(int id, ProviderRequest request);

    Task<bool> SoftDeleteAsync(int id);
}