using Pragmap.Controllers.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace Pragmap.Domain.Entities
{
    public class Role
    {
        public const string ADMINISTRATOR = "Administrateur";
        public const string MANAGER = "Gestionnaire";
				public const string EDITOR = "Éditeur";
        public const string READER = "Lecteur";

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        [JsonIgnore]
        public virtual ICollection<User>? Users { get; set; }

    }
}
