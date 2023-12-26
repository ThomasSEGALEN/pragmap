using Microsoft.AspNetCore.Mvc;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.Context;
using Pragmap.Infrastructure.UnitOfWork;


namespace Pragmap.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RoleController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public RoleController(IUnitOfWork unitOfWork) {
            _unitOfWork = unitOfWork;
         }

        [HttpGet]
        public IEnumerable<Role> GetAllRoles()
        {
            return _unitOfWork.GetRepository<Role>().GetAll();
        }

    }
}
