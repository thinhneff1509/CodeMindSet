export const GRID = 9;
export const COLORS = [1,2,3,4,5,6,7];

const inb = (r:number,c:number)=> r>=0 && r<GRID && c>=0 && c<GRID;

export function newBoard(): number[][] {
    const b = Array.from({length: GRID}, () => Array(GRID).fill(0));
    return b;
}

// Gán kiểu rõ ràng thay vì const cells = []
export function randomEmptyCells(board: number[][]): { r:number; c:number }[] {
    const cells: { r:number; c:number }[] = [];
    for (let r=0; r<GRID; r++) {
        for (let c=0; c<GRID; c++) {
            if (board[r][c] === 0) cells.push({ r, c });
        }
    }
    return cells;
}

export function randInt(n:number){ return Math.floor(Math.random()*n); }
export function randomColors(n:number){ return Array.from({length:n},()=> COLORS[randInt(COLORS.length)]); }

export function placeRandomBalls(board:number[][], colors:number[]): number[][] {
    const empties: { r:number; c:number }[] = randomEmptyCells(board);
    for (const color of colors) {
        if (!empties.length) break;
        const idx = randInt(empties.length);
        const { r, c } = empties.splice(idx, 1)[0];
        board[r][c] = color;
    }
    return board;
}

// Gán kiểu cho q và dirs
export function canMove(
    board:number[][],
    from:{ r:number; c:number },
    to:{ r:number; c:number }
): boolean {
    if (board[from.r][from.c]===0 || board[to.r][to.c]!==0) return false;
    const q: { r:number; c:number }[] = [from];
    const vis = Array.from({length:GRID},()=>Array(GRID).fill(false));
    const dirs: [number, number][] = [[1,0],[-1,0],[0,1],[0,-1]];
    vis[from.r][from.c]=true;

    while (q.length) {
        const cur = q.shift()!;
        if (cur.r===to.r && cur.c===to.c) return true;
        for (const [dr,dc] of dirs) {
            const nr = cur.r+dr, nc = cur.c+dc;
            if (inb(nr,nc) && !vis[nr][nc] && board[nr][nc]===0) {
                vis[nr][nc] = true;
                q.push({ r:nr, c:nc });
            }
        }
    }
    return false;
}

export function findLines(board:number[][]): { cells:{ r:number; c:number }[] }[] {
    const res: { cells:{ r:number; c:number }[] }[] = [];
    const dirs: [number, number][] = [[0,1],[1,0],[1,1],[1,-1]];
    const seen = new Set<string>();
    const key = (r:number,c:number)=> `${r},${c}`;

    for (let r=0; r<GRID; r++) for (let c=0; c<GRID; c++) {
        const color = board[r][c];
        if (color===0) continue;
        for (const [dr,dc] of dirs){
            const cells: { r:number; c:number }[] = [{ r, c }];
            let nr=r+dr, nc=c+dc;
            while (inb(nr,nc) && board[nr][nc]===color) {
                cells.push({ r:nr, c:nc });
                nr+=dr; nc+=dc;
            }
            if (cells.length>=5){
                const pr=r-dr, pc=c-dc;
                if (!inb(pr,pc) || board[pr][pc]!==color){
                    const k = cells.map(p=>key(p.r,p.c)).sort().join('|');
                    if (!seen.has(k)) { seen.add(k); res.push({ cells }); }
                }
            }
        }
    }
    return res;
}

export function removeCells(board:number[][], cells:{ r:number; c:number }[]){
    for (const {r,c} of cells) board[r][c]=0;
}

export function applyMove(board:number[][], from:{ r:number; c:number }, to:{ r:number; c:number }){
    const color = board[from.r][from.c];
    board[from.r][from.c]=0;
    board[to.r][to.c]=color;
}

export function step(board:number[][], nextColors:number[]){
    const lines = findLines(board);
    let scored = 0;
    if (lines.length){
        for (const line of lines){ removeCells(board, line.cells); scored += line.cells.length; }
        return { board, scored, nextColors: randomColors(3), cleared: true };
    } else {
        placeRandomBalls(board, nextColors);
        const lines2 = findLines(board);
        if (lines2.length){
            for (const line of lines2){ removeCells(board, line.cells); scored += line.cells.length; }
        }
        return { board, scored, nextColors: randomColors(3), cleared: false };
    }
}

export function isGameOver(board:number[][]){
    return randomEmptyCells(board).length===0;
}
