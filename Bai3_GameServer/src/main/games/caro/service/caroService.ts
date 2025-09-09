import { Injectable } from '@nestjs/common';
import { CaroBoard, Cell } from '../logicGameCaro/logicGameCaro';

type PlayerRole = 'X' | 'O';
type RoomId = string;

interface RoomState {
    roomId: RoomId;
    board: CaroBoard;
    players: Record<PlayerRole, string>; // socket.id
    turn: PlayerRole;
    over: boolean;
}

@Injectable()
export class CaroService {
    waiting: string | null = null; // socket.id waiting
    rooms = new Map<RoomId, RoomState>();

    createRoom(aSocketId: string, bSocketId: string): RoomState {
        const roomId = `caro-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
        // random who is X
        const roles: PlayerRole[] = Math.random() < 0.5 ? ['X', 'O'] : ['O', 'X'];
        const st: RoomState = {
            roomId,
            board: new CaroBoard(),
            players: { [roles[0]]: aSocketId, [roles[1]]: bSocketId } as any,
            turn: 'X',
            over: false,
        };
        this.rooms.set(roomId, st);
        return st;
    }

    findRoomBySocket(socketId: string) {
        for (const st of this.rooms.values()) {
            if (st.players.X === socketId || st.players.O === socketId) return st;
        }
        return null;
    }

    getRole(st: RoomState, socketId: string): PlayerRole | null {
        if (st.players.X === socketId) return 'X';
        if (st.players.O === socketId) return 'O';
        return null;
    }

    handleMove(roomId: RoomId, socketId: string, r: number, c: number, v: Cell) {
        const st = this.rooms.get(roomId);
        if (!st) return { ok: false, msg: 'Room not found' };
        if (st.over) return { ok: false, msg: 'Game already over' };

        const role = this.getRole(st, socketId);
        if (!role) return { ok: false, msg: 'You are not in this room' };
        if (v !== role) return { ok: false, msg: 'Wrong symbol' };
        if (st.turn !== role) return { ok: false, msg: 'Not your turn' };

        const placed = st.board.place(r, c, v);
        if (!placed.ok) return { ok: false, msg: placed.msg };

        // toggle turn
        if (placed.win) {
            st.over = true;
            return { ok: true, win: placed.win, nextTurn: null };
        } else {
            st.turn = st.turn === 'X' ? 'O' : 'X';
            return { ok: true, win: null, nextTurn: st.turn };
        }
    }

    endRoom(roomId: string) {
        this.rooms.delete(roomId);
    }
}
