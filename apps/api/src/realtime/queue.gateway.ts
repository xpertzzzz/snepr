import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from "@nestjs/websockets";
import { Logger } from "@nestjs/common";
import { Server, Socket } from "socket.io";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger("QueueGateway");

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("join:salon")
  handleJoinSalon(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { salonId: string }
  ) {
    const room = `salon:${data.salonId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    return { success: true, room };
  }

  @SubscribeMessage("join:token")
  handleJoinToken(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tokenId: string }
  ) {
    const room = `token:${data.tokenId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} joined token room: ${room}`);
    return { success: true, room };
  }

  // Server-side broadcasting helpers
  emitTokenJoined(salonId: string, token: any) {
    this.server.to(`salon:${salonId}`).emit("queue:token_joined", token);
  }

  emitTokenCalled(salonId: string, token: any) {
    this.server.to(`salon:${salonId}`).emit("queue:token_called", token);
    this.server.to(`token:${token.id}`).emit("queue:token_called", token);
  }

  emitTokenCompleted(salonId: string, token: any) {
    this.server.to(`salon:${salonId}`).emit("queue:token_completed", token);
    this.server.to(`token:${token.id}`).emit("queue:token_completed", token);
  }

  emitChairStatusChanged(salonId: string, chair: any) {
    this.server.to(`salon:${salonId}`).emit("chair:status_changed", chair);
  }
}

