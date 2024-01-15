using Pragmap.Domain.Common.Interfaces;
using System.ComponentModel.DataAnnotations;

namespace Pragmap.Domain.Entities
{
    public class Customer : IDatedEntity
    {
        public Guid Id { get; set; }

        [MaxLength(255)]
        public string Name { get; set; }

        public string Logo { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public virtual ICollection<CustomerUser>? CustomerUsers { get; set; }

    }
}