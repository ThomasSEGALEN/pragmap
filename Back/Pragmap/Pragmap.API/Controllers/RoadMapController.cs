using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Pragmap.API.Application.Commands;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Controllers
{
    public class RoadMapController : ODataController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMediator _mediatR;

        public RoadMapController(IUnitOfWork unitOfWork, IMediator mediatR)
        {
            _unitOfWork = unitOfWork;
            _mediatR = mediatR;
        }

        [EnableQuery]
        public IQueryable<RoadMap> Get()
        {
            return _unitOfWork.GetRepository<RoadMap>().GetAll();
        }

        public RoadMap? Get(Guid key)
        {
            return _unitOfWork.GetRepository<RoadMap>().Single(key);
        }

        public async Task<IActionResult> Post(CreateRoadMapCommand createRoadMapCommand)
        {
            var result = await _mediatR.Send(createRoadMapCommand);
            if (result.IsSuccess)
            {
                await _unitOfWork.Complete();
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        public async Task<IActionResult> Put(Guid key, [FromBody] UpdateRoadMapCommand updateRoadMapCommand)
        {
            var result = await _mediatR.Send(updateRoadMapCommand);
            if (result.IsSuccess)
            {
                await _unitOfWork.Complete();
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }
    }
}
