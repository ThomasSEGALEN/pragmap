using Microsoft.AspNetCore.Mvc;
using Pragmap.Services;
using Pragmap.Models;

namespace Pragmap.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly ILogger<UsersController> _logger;


        public UsersController(ILogger<UsersController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name ="GetUsers")]
        public IEnumerable<User> GetUsers()
        {
            return UsersServices.GetUsers();
        }
    }
}
