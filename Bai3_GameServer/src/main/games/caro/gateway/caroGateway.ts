import {
    WebSocketGateway, WebSocketServer, SubscribeMessage,
    ConnectedSocket, MessageBody
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

type Side = 'X' | 'O';
interface RoomInfo { id: string; x: Socket; o: Socket; turn: Side; }

@Injectable()
@WebSocketGateway({ namespace: '/caro', cors: { origin: '*' } })
export class CaroGateway {
    @WebSocketServer() io!: Server;

    // Hàng đợi & phòng đang chơi
    private waiting: Socket | null = null;
    private rooms = new Map<string, RoomInfo>();

    handleConnection(sock: Socket) {
        // console.log('[caro] connect', sock.id);
    }

    handleDisconnect(sock: Socket) {
        // nếu đang chờ thì bỏ khỏi hàng đợi
        if (this.waiting?.id === sock.id) this.waiting = null;

        // nếu đang ở phòng nào thì huỷ phòng
        for (const [roomId, r] of this.rooms) {
            if (r.x.id === sock.id || r.o.id === sock.id) {
                this.rooms.delete(roomId);
                const other = r.x.id === sock.id ? r.o : r.x;
                other.emit('errorMsg', 'Đối thủ đã rời phòng.');
                other.leave(roomId);
                break;
            }
        }
    }

    @SubscribeMessage('findMatch')
    onFindMatch(@ConnectedSocket() sock: Socket) {
        if (!this.waiting) {
            this.waiting = sock;                          // đưa vào hàng đợi
            sock.emit('queue', { status: 'waiting' });
            return;
        }
        // ghép với người đang chờ
        const x = this.waiting;
        const o = sock;
        this.waiting = null;

        const roomId = `caro_${Date.now()}_${Math.random().toString(36).slice(2,7)}`;
        x.join(roomId);
        o.join(roomId);

        const turn: Side = Math.random() < 0.5 ? 'X' : 'O';
        this.rooms.set(roomId, { id: roomId, x, o, turn });

        x.emit('matchFound', { roomId, you: 'X', turn });
        o.emit('matchFound', { roomId, you: 'O', turn });
    }

    @SubscribeMessage('move')
    onMove(
        @ConnectedSocket() sock: Socket,
        @MessageBody() body: { roomId: string; r: number; c: number; v: Side }
    ) {
        const room = this.rooms.get(body.roomId);
        if (!room) return sock.emit('errorMsg', 'Phòng không tồn tại.');

        // kiểm tra đúng lượt
        const isX = room.x.id === sock.id;
        const mySide: Side = isX ? 'X' : 'O';
        if (room.turn !== mySide) {
            return sock.emit('errorMsg', 'Chưa đến lượt bạn.');
        }

        // phát nước đi cho cả phòng
        this.io.to(room.id).emit('acceptMove', { r: body.r, c: body.c, v: mySide });

        // đổi lượt
        room.turn = mySide === 'X' ? 'O' : 'X';

        // thông báo cho đối thủ cập nhật
        const opp = isX ? room.o : room.x;
        opp.emit('opponentMove', { r: body.r, c: body.c, v: mySide });

        // this.io.to(room.id).emit('gameOver', { winner: 'X' | 'O', line: [...] });
    }
}
