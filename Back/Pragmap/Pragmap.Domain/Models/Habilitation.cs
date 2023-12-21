using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pragmap.Domain.Models
{
    public class Habilitation
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public Guid Id { get; set; }
        public ICollection<Client> Clients { get; set;}

        public ICollection<RoadMap>RoadMaps { get; set;}
    }
}
