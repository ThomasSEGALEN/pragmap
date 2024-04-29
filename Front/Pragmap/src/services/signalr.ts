// signalrService.js
import type { UserPostion } from "@/types/userPosition";
import * as signalR from "@microsoft/signalr";

class SignalRService {
    connection!: signalR.HubConnection;
    startConnection() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:44323/roadmaphub").withAutomaticReconnect()
            .build();

        this.connection.start().catch((err: any) => console.error("SignalR Connection Error: ", err));
    }

    joinRoadMap(roadmapId: string) {
        this.connection.invoke("JoinRoadMap", roadmapId);
    }
    leaveRoadMap(roadmapId: string) {
        this.connection.invoke("LeaveRoadMap", roadmapId);
    }

    updateRoadmapData(roadmapId: string, data: string) {
        this.connection.invoke("UpdateRoadmapData", roadmapId, data);
    }

    receiveRoadmapData(callback: (message: string) => any) {
        this.connection.on("ReceiveRoadMapData", (message: string) => {
            callback(message);
        });
    }

    updateUserPosition(roadmapId: string, userPosition: UserPostion) {
        this.connection.invoke("UpdateUserPosition", roadmapId, userPosition);
    }

    receiveUserPosition(callback: (userPostion: UserPostion) => any) {
        this.connection.on("ReceiveUserPosition", (userPosition: UserPostion) => {
            callback(userPosition);
        });
    }
}

export const signalRService = new SignalRService();