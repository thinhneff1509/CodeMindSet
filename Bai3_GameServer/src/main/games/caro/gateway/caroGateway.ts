import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CaroService } from '../service/caroService';

@WebSocketGateway({ namespace: '/caro', cors: true })
export class CaroGateway implements OnGatewayConnection {
    @WebSocketServer() server: Server;

    constructor(private readonly caro: CaroService) {}

    handleConnection(client: Socket) {
        // no-op; wait for findMatch
    }

    @SubscribeMessage('findMatch')
    async findMatch(@ConnectedSocket() client: Socket) {
        if (!this.caro.waiting) {
            this.caro.waiting = client.id;
            client.emit('waiting', 'Đang chờ đối thủ...');
            return;
        }

        const mate = this.caro.waiting;
        this.caro.waiting = null;

        const st = this.caro.createRoom(mate, client.id);
        // join 2 sockets to room
        const a = this.server.sockets.sockets.get(st.players.X);
        const b = this.server.sockets.sockets.get(st.players.O);
        a?.join(st.roomId);
        b?.join(st.roomId);

        // notify both
        this.server.to(st.roomId).emit('matchFound', {
            roomId: st.roomId,
            you: null,            // client sẽ set dựa trên socket.id
            turn: st.turn,
        });

        // gửi “you” riêng lẻ
        a?.emit('matchFound', { roomId: st.roomId, you: 'X', turn: st.turn });
        b?.emit('matchFound', { roomId: st.roomId, you: 'O', turn: st.turn });
    }

    @SubscribeMessage('move')
    onMove(
        @MessageBody() body: { roomId: string; r: number; c: number; v: 'X' | 'O' },
        @ConnectedSocket() client: Socket,
    ) {
        const { roomId, r, c, v } = body;
        const result = this.caro.handleMove(roomId, client.id, r, c, v);
        if (!result.ok) {
            client.emit('errorMsg', result.msg);
            return;
        }

        // echo back to mover & opponent
        client.emit('acceptMove', { r, c, v });
        client.to(roomId).emit('opponentMove', { r, c, v });

        if (result.win) {
            this.server.to(roomId).emit('gameOver', {
                winner: result.win.winner,
                line: result.win.line,
            });
            this.caro.endRoom(roomId);
        }
    }
}
