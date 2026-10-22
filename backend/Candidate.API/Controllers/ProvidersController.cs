using Candidate.API.DTOs;
using Candidate.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Candidate.API.Controllers;

[ApiController]
[Route("api/providers")]
public class ProvidersController : ControllerBase
{
    private readonly IProviderService _providerService;

    public ProvidersController(IProviderService providerService)
    {
        _providerService = providerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
    [FromQuery] string? search,
    CancellationToken cancellationToken)
    {
        var providers = await _providerService.GetAllAsync(
            search,
            cancellationToken
        );

        return Ok(providers);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var provider =
            await _providerService.GetByIdAsync(id);

        return provider == null
            ? NotFound()
            : Ok(provider);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] ProviderRequest request)
    {
        var provider =
            await _providerService.CreateAsync(request);

        return CreatedAtAction(
            nameof(GetById),
            new { id = provider.ProviderId },
            provider);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] ProviderRequest request)
    {
        var updated =
            await _providerService.UpdateAsync(id, request);

        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _providerService.SoftDeleteAsync(id);

        return deleted ? NoContent() : NotFound();
    }
}