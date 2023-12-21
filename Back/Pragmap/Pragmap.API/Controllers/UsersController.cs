using Microsoft.AspNetCore.Mvc;
using Npgsql;

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

        [HttpGet]
        public IActionResult GetUsers()
        {
            return Ok(UsersServices.GetUsers());
        }
    }
}
