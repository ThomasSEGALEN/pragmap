using System.Text.RegularExpressions;

namespace Pragmap.API.Application.Helpers
{
    public class ValidationHelper
    {
        public static bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^([\w\.\-]+)@([\w\-]+)(\.[\w]{2,})+$");
        }

        public static bool IsValidPassword(string password)
        {
            return Regex.IsMatch(password, "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{6,}");
        }
    }
}
