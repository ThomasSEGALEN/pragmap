using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Pragmap.Controllers.Entities;

namespace Pragmap.Domain.Entities
{
    public class ResetPasswordToken
    {
        public Guid UserId { get; set; }
        public Guid Token { get; set; }
        public DateTime TokenExpiresAt { get; set; }
        public virtual User User { get; set; }

        public const string MailSubject = "Réinitialisation de votre mot de passe";
        public static string GetMailBody(Guid token)
        {
            string resetLink = $"https://pragmap.vercel.app/reset-password?token={token}";
            //Il faut laisser l'indentation pour que le mail soit bien formaté
            return $@"Bonjour,

Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous pour procéder à la réinitialisation :

{resetLink}

Ce lien sera valide pendant 1 heure.

Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet e-mail.

Cordialement";
        }
    }
}
