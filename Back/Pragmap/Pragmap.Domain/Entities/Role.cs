using Pragmap.Controllers.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Pragmap.Domain.Entities
{
    public class Role
    {
        public const string ADMINISTRATEUR = "Administrateur";
        public const string GESTIONNAIRE = "Gestionnaire";
        public const string LECTEUR = "Lecteur";
        public const string EDITEUR = "Editeur";

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; }
    }
}
