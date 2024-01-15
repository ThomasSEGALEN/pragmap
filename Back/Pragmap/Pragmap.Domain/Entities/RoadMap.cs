using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Pragmap.Domain.Common.Interfaces;

namespace Pragmap.Domain.Entities
{
    public class RoadMap : IDatedEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        
        [MaxLength(255)]
        public string Name { get; set; }

        [Column(TypeName = "jsonb")]
        public string Data { get; set; } 

        public Guid CustomerId { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }
    }
}