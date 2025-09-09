export const GRID = 9;
const CELL = 60; // 9 * 60 = 540
const PADDING = 4;

const COLOR_MAP = {
    1: '#F94144', 2: '#F3722C', 3: '#F9C74F',
    4: '#90BE6D', 5: '#43AA8B', 6: '#577590', 7: '#9B5DE5'
};

export class Line98Canvas {
    constructor(canvas, onCellClick) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.onCellClick = onCellClick;
        this.board = Array.from({length:GRID},()=>Array(GRID).fill(0));
        this.selected = null;

        canvas.addEventListener('click', (e)=> {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left, y = e.clientY - rect.top;
            const c = Math.floor(x / CELL), r = Math.floor(y / CELL);
            if (r>=0 && r<GRID && c>=0 && c<GRID) this.onCellClick({r,c});
        });
    }

    setBoard(b){ this.board = b; this.draw(); }
    setSelected(pos){ this.selected = pos; this.draw(); }

    drawGrid(){
        const g=this.ctx;
        g.clearRect(0,0,this.canvas.width,this.canvas.height);
        g.strokeStyle = '#2b3138';
        for (let i=0;i<=GRID;i++){
            g.beginPath(); g.moveTo(0, i*CELL); g.lineTo(GRID*CELL, i*CELL); g.stroke();
            g.beginPath(); g.moveTo(i*CELL, 0); g.lineTo(i*CELL, GRID*CELL); g.stroke();
        }
    }

    drawBalls(){
        const g=this.ctx;
        for (let r=0;r<GRID;r++) for (let c=0;c<GRID;c++){
            const val = this.board[r][c];
            if (!val) continue;
            const x=c*CELL + CELL/2, y=r*CELL + CELL/2;
            g.beginPath();
            g.arc(x, y, CELL/2 - PADDING, 0, Math.PI*2);
            g.fillStyle = COLOR_MAP[val] || '#aaa';
            g.fill();
            g.lineWidth=2; g.strokeStyle='rgba(255,255,255,.2)'; g.stroke();
        }
    }

    drawSelection(){
        if (!this.selected) return;
        const g=this.ctx, {r,c}=this.selected;
        g.lineWidth=3; g.strokeStyle='#fff';
        g.strokeRect(c*CELL+2, r*CELL+2, CELL-4, CELL-4);
    }

    draw(){
        this.drawGrid();
        this.drawBalls();
        this.drawSelection();
    }
}

export function renderNextColors(el, arr){
    el.innerHTML = arr.map(color => `<span class="dot" style="background:${COLOR_MAP[color]}"></span>`).join('');
}
