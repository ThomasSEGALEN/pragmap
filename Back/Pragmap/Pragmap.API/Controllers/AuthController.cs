using MediatR;
using Microsoft.AspNetCore.Mvc;
using Pragmap.API.Application.Commands.Auth;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : Controller
    {
        private readonly IMediator _mediatR;
        private readonly IUnitOfWork _unitOfWork;
        public AuthController(IMediator mediatR, IUnitOfWork unitOfWork)
        {
            _mediatR = mediatR;
            _unitOfWork = unitOfWork;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginCommand loginCommand)
        {
            var result = await _mediatR.Send(loginCommand);
            if (result.IsSuccess)
            {
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }
    }
}
