using System;
using System.Collections.Generic;
using AuthenticationServer.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationServer.Data;

public partial class AuthenticationDbContext : DbContext
{
    public AuthenticationDbContext()
    {
    }

    public AuthenticationDbContext(DbContextOptions<AuthenticationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AppUser> AppUsers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AppUser>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__AppUsers__3214EC0779567C49");

            entity.Property(e => e.Id).HasDefaultValueSql("(newid())");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
