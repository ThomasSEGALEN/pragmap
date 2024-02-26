﻿using MediatR;
using Pragmap.API.Application.Helpers;
using Pragmap.API.Application.Models;
using Pragmap.Controllers.Entities;
using Pragmap.Infrastructure.UnitOfWork;

namespace Pragmap.API.Application.Commands
{
    public class UpdatePasswordCommandHandler : IRequestHandler<UpdatePasswordCommand, CommandResult>
    {
        private readonly IUnitOfWork _unitOfWork;

        public UpdatePasswordCommandHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public Task<CommandResult> Handle(UpdatePasswordCommand request, CancellationToken cancellationToken)
        {
            if(request.UserId.Equals(Guid.Empty))
            {
                return Task.FromResult(CommandResult.Failed("L'identifiant de l'utilisateur est requis"));
            }

            if(string.IsNullOrEmpty(request.OldPassword))
            {
                return Task.FromResult(CommandResult.Failed("L'ancien mot de passe est requis"));
            }

            if(string.IsNullOrEmpty(request.NewPassword))
            {
                return Task.FromResult(CommandResult.Failed("Le nouveau mot de passe est requis"));
            }

            var userRepo = _unitOfWork.GetRepository<User>();
            var user = userRepo.Single(request.UserId);
            
            if(user == null)
            {
                return Task.FromResult(CommandResult.Failed("Cet utilisateur n'existe pas"));
            }

            if(!User.HashPassword(request.OldPassword).Equals(user.PasswordHash))
            {
                return Task.FromResult(CommandResult.Failed("L'ancien mot de passe est incorrect"));
            }

            if (!ValidationHelper.IsValidPassword(request.NewPassword))
            {
                return Task.FromResult(CommandResult.Failed("Le mot de passe doit contenir au moins 6 caractères dont une majuscule, une minuscule, un chiffre et un caractère spécial."));
            }

            user.PasswordHash = User.HashPassword(request.NewPassword);
            userRepo.Update(user);

            return Task.FromResult(CommandResult.Success());
        }
    }
}
