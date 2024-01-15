using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pragmap.Infrastructure.Context
{
    public class PragmapContext : DbContext
    {
        public PragmapContext(DbContextOptions<PragmapContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<CustomerUser> CustomersUsers { get; set; }
        public DbSet<Customer> Customer { get; set; }
        public DbSet<RoadMap> RoadMaps { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configuration pour la relation User-Role
            modelBuilder.Entity<CustomerUser>()
                .HasOne(ur => ur.User)
                .WithMany(u => u.UserCustomers)
                .HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<CustomerUser>()
                .HasOne(ur => ur.Customer)
                .WithMany(r => r.CustomerUsers)
                .HasForeignKey(ur => ur.CustomerId);

            modelBuilder.Entity<User>()
               .HasIndex(u => u.Email)
               .IsUnique();
        }
    }
}
