using Candidate.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Candidate.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(
        DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }


    public DbSet<Provider> Providers => Set<Provider>();

    public DbSet<ProviderLicense> Licenses => Set<ProviderLicense>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Provider>()
        .HasQueryFilter(p => !p.IsDeleted);

        modelBuilder.Entity<ProviderLicense>()
            .HasQueryFilter(l => !l.Provider.IsDeleted);

        modelBuilder.Entity<Provider>(entity =>
        {
            entity.ToTable("Providers");

            entity.HasKey(p => p.ProviderId);

            entity.Property(p => p.ProviderName)
                .IsRequired();

            entity.Property(p => p.County)
                .IsRequired();

            entity.Property(p => p.Status)
                .IsRequired();

            entity.Property(p => p.CreatedDate)
                .IsRequired();

            entity.Property(p => p.IsDeleted)
                .HasDefaultValue(false);

            // Standard queries exclude deleted providers.
            entity.HasQueryFilter(p => !p.IsDeleted);

            entity.HasMany(p => p.Licenses)
                .WithOne(l => l.Provider)
                .HasForeignKey(l => l.ProviderId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<ProviderLicense>(entity =>
        {
            entity.ToTable("Licenses");

            entity.HasKey(l => l.LicenseId);

            entity.Property(l => l.LicenseNumber)
                .IsRequired();

            entity.Property(l => l.LicenseStatus)
                .IsRequired();

            entity.Property(l => l.ExpirationDate)
                .IsRequired();

            entity.HasIndex(l => new
            {
                l.ProviderId,
                l.LicenseNumber
            }).IsUnique();

            // Ensure licenses belonging to deleted
            // providers do not appear in standard queries.
            entity.HasQueryFilter(l => !l.Provider.IsDeleted);
        });
    }

    public override int SaveChanges()
    {
        ApplyAuditRules();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        ApplyAuditRules();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyAuditRules()
    {
        foreach (var entry in ChangeTracker.Entries<Provider>())
        {
            if (entry.State == EntityState.Deleted)
            {
                entry.State = EntityState.Modified;
                entry.Entity.IsDeleted = true;
                entry.Entity.DeletedDate ??= DateTime.UtcNow;
            }

            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedDate = DateTime.UtcNow;
                entry.Entity.IsDeleted = false;
                entry.Entity.DeletedDate = null;
            }

            if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedDate = DateTime.UtcNow;
            }
        }
    }
}