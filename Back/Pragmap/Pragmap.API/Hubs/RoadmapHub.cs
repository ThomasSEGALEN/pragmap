using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pragmap.API.Hubs
{
    public class RoadmapHub : Hub
    {
        public async Task JoinRoadmap(string roadmapId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"roadmap-{roadmapId}");
        }

        public async Task LeaveRoadmap(string roadmapId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"roadmap-{roadmapId}");
        }

        public async Task UpdateRoadmapData(string roadmapId, string data)
        {
            await Clients.Group($"roadmap-{roadmapId}").SendAsync("ReceiveRoadmapData", data);
        }
        public async Task UpdateUserPosition(string roadmapId, UserPosition userPosition)
        {
            await Clients.Group($"roadmap-{roadmapId}").SendAsync("ReceiveUserPosition", userPosition);
        }
       
    }
    public class UserPosition
    {
        public string UserId { get; set; }
        public string Username { get; set; }
        public decimal XPosition { get; set; }
        public decimal YPosition { get; set; }
        public decimal Scale { get; set; }
    }
}
