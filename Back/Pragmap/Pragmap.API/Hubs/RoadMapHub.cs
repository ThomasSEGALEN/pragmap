using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Pragmap.API.Hubs
{
    public class RoadMapHub : Hub
    {
        public async Task JoinRoadMap(string roadmapId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"roadmap-{roadmapId}");
        }

        public async Task LeaveRoadMap(string roadmapId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"roadmap-{roadmapId}");
        }

        public async Task SendMessage(string roadmapId, string message)
        {
            await Clients.Group($"roadmap-{roadmapId}").SendAsync("ReceiveRoadMapMessage", message);
        }
    }
}
