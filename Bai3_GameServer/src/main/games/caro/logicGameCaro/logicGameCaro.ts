// Simple board + win check logic (15x15, 5 in a row)
export type Cell = '' | 'X' | 'O';

export class CaroBoard {
    readonly size = 15;
    board: Cell[][];

    constructor() {
        this.board = Array.from({ length: this.size }, () => Array<Cell>(this.size).fill(''));
    }

    inBounds(r: number, c: number) {
        return r >= 0 && c >= 0 && r < this.size && c < this.size;
    }

    place(r: number, c: number, v: Cell) {
        if (!this.inBounds(r, c)) return { ok: false, msg: 'Out of board' };
        if (v !== 'X' && v !== 'O') return { ok: false, msg: 'Invalid symbol' };
        if (this.board[r][c]) return { ok: false, msg: 'Cell occupied' };
        this.board[r][c] = v;
        const win = this.checkWin(r, c, v);
        return { ok: true, win };
    }

    // check 4 directions: (1,0), (0,1), (1,1), (1,-1)
    checkWin(r: number, c: number, v: Cell) {
        const dirs = [
            [1, 0],
            [0, 1],
            [1, 1],
            [1, -1],
        ];
        for (const [dr, dc] of dirs) {
            const line = [[r, c]];
            // forward
            let rr = r + dr, cc = c + dc;
            while (this.inBounds(rr, cc) && this.board[rr][cc] === v) {
                line.push([rr, cc]);
                rr += dr; cc += dc;
            }
            // backward
            rr = r - dr; cc = c - dc;
            while (this.inBounds(rr, cc) && this.board[rr][cc] === v) {
                line.unshift([rr, cc]);
                rr -= dr; cc -= dc;
            }
            if (line.length >= 5) return { winner: v, line };
        }
        return null;
    }
}
