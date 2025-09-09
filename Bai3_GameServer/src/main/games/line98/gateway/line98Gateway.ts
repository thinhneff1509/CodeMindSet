import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class GamesGateway {
    @WebSocketServer() server: Server;

    @SubscribeMessage('join')
    handleJoin(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
        client.join(room);
        client.emit('joined', room);
    }

    // phát state này từ Controller/Service nếu muốn multi-player.
    broadcastState(room: string, payload: any){
        this.server.to(room).emit('state', payload);
    }
}
