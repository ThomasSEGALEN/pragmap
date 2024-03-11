using Pragmap.Controllers.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pragmap.Domain.Entities
{
    public class UpdateEmailToken
    {
        public Guid UserId { get; set; }
        public Guid Token { get; set; }
        public DateTime TokenExpiresAt { get; set; }
        public string NewEmail { get; set; }
        public string OldEmail { get; set; }
        public DateTime? TokenUsedAt { get; set; }
        public virtual User User { get; set; }

        public const string MailSubject = "Changement d'adresse e-mail";
        public static string GetMailBody(string email, Guid token)
        {
            string resetLink = $"https://pragmap.vercel.app/update-email?token={token}";
            //Il faut laisser l'indentation pour que le mail soit bien formaté
            return $"Bonjour,\n\nVous avez demandé un changement d'adresse e-mail pour l'addresse : {email}. Cliquez sur le lien ci-dessous pour procéder à la modification :\n\n{resetLink}\n\nCe lien sera valide pendant 1 heure.\n\nSi vous n'avez pas demandé cette modification, veuillez ignorer cet e-mail.\n\nCordialement";
        }
    }
}
