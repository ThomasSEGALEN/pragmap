using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Pragmap.API.Application.Commands;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Controllers
{
    public class RoadmapController : ODataController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMediator _mediatR;

        public RoadmapController(IUnitOfWork unitOfWork, IMediator mediatR)
        {
            _unitOfWork = unitOfWork;
            _mediatR = mediatR;
        }

        [EnableQuery]
        public IQueryable<Roadmap> Get()
        {
            return _unitOfWork.GetRepository<Roadmap>().GetAll();
        }

        public Roadmap? Get(Guid key)
        {
            return _unitOfWork.GetRepository<Roadmap>().Single(key);
        }

        public async Task<IActionResult> Post([FromBody] CreateRoadmapCommand createRoadmapCommand)
        {
            var result = await _mediatR.Send(createRoadmapCommand);
            if (result.IsSuccess)
            {
                await _unitOfWork.Complete();
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        public async Task<IActionResult> Put(Guid key, [FromBody] UpdateRoadmapCommand updateRoadmapCommand)
        {
            var result = await _mediatR.Send(updateRoadmapCommand);
            if (result.IsSuccess)
            {
                await _unitOfWork.Complete();
                return Ok(result.Data);
            }
            return BadRequest(result.Error);
        }

        public async Task<IActionResult> Delete([FromRoute] Guid key)
        {
            var roadmapRepository = _unitOfWork.GetRepository<Roadmap>();
            Roadmap? roadmap = roadmapRepository.Single(u => u.Id.Equals(key));
            if (roadmap == null)
            {
                return BadRequest();
            }
            roadmapRepository.Delete(roadmap);
            await _unitOfWork.Complete();
            return NoContent();
        }
    }
}
