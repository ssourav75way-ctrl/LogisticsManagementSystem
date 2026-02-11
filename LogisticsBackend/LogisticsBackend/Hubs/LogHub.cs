using Microsoft.AspNetCore.SignalR;

namespace LogisticsBackend.Hubs;

public class LogHub : Hub
{
    public async Task JoinLogGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
    }

    public async Task LeaveLogGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
    }
}
