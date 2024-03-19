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

        public async Task SendMessage(string roadmapId, string message)
        {
            await Clients.Group($"roadmap-{roadmapId}").SendAsync("ReceiveRoadmapMessage", message);
        }
    }
}
