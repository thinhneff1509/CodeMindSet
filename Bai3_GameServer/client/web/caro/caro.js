import { apiMe, clearToken, getToken } from '../auth.js';
import { createSocketNS } from '../socket.js';

const $ = (id)=>document.getElementById(id);

const SIZE = 15;
const CELL = 36;
const PADDING = 10;

const canvas = $('board');
const ctx = canvas.getContext('2d');
const statusEl = $('status');
const youAreEl = $('youAre');
const gamePanel = $('gamePanel');

let socket = null;
let roomId = null;
let you = null;          // 'X' | 'O'
let yourTurn = false;    // bool
let board = Array.from({length: SIZE}, () => Array(SIZE).fill('')); // '' | 'X' | 'O'

function renderAuthUI(user){
    if (user) {
        $('me').textContent = `Xin chào, ${user.username ?? 'player'}`;
        $('btnLogout').style.display = 'inline-block';
        gamePanel.style.display = '';
    } else {
        $('me').textContent = '';
        $('btnLogout').style.display = 'none';
        gamePanel.style.display = 'none';
    }
}

function drawBoard() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#141b23';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = '#2b3138';
    for (let i=0;i<=SIZE;i++){
        const x = PADDING + i*CELL;
        const y = PADDING + i*CELL;
        ctx.beginPath();
        ctx.moveTo(PADDING, y);
        ctx.lineTo(PADDING + SIZE*CELL, y);
        ctx.moveTo(x, PADDING);
        ctx.lineTo(x, PADDING + SIZE*CELL);
        ctx.stroke();
    }

    ctx.font = '24px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let r=0;r<SIZE;r++){
        for (let c=0;c<SIZE;c++){
            const v = board[r][c];
            if (!v) continue;
            const x = PADDING + c*CELL + CELL/2;
            const y = PADDING + r*CELL + CELL/2;
            ctx.fillStyle = (v==='X') ? '#ffd166' : '#7cc0ff';
            ctx.fillText(v, x, y);
        }
    }
}

function fromCanvas(ev){
    const rect = canvas.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const c = Math.floor((x - PADDING) / CELL);
    const r = Math.floor((y - PADDING) / CELL);
    if (r<0||c<0||r>=SIZE||c>=SIZE) return null;
    return {r,c};
}

$('btnFind').addEventListener('click', () => {
    if (!getToken()) { alert('Hãy đăng nhập trước.'); return; }

    socket?.disconnect();
    socket = createSocketNS('/caro'); // namespace /caro
    statusEl.textContent = 'Đang ghép cặp...';

    socket.on('connect', () => socket.emit('findMatch'));

    socket.on('matchFound', (data) => {
        roomId = data.roomId;
        you    = data.you;             // 'X' | 'O'
        yourTurn = data.turn === you;

        youAreEl.textContent = you;
        statusEl.textContent = `Phòng ${roomId} – Lượt: ${yourTurn ? 'Bạn' : 'Đối thủ'}`;
        board = Array.from({length: SIZE}, () => Array(SIZE).fill(''));
        drawBoard();
    });

    canvas.onclick = (ev) => {
        if (!yourTurn || !roomId) return;
        const pos = fromCanvas(ev);
        if (!pos || board[pos.r][pos.c]) return;
        socket.emit('move', { roomId, r: pos.r, c: pos.c, v: you });
    };

    socket.on('opponentMove', ({ r, c, v }) => {
        board[r][c] = v;
        yourTurn = true;
        statusEl.textContent = `Lượt của bạn`;
        drawBoard();
    });

    socket.on('acceptMove', ({ r, c, v }) => {
        board[r][c] = v;
        yourTurn = false;
        statusEl.textContent = `Lượt đối thủ`;
        drawBoard();
    });

    socket.on('gameOver', ({ winner }) => {
        drawBoard();
        statusEl.textContent = winner ? `Kết thúc: ${winner} thắng` : 'Hòa';
        alert(winner ? `Bạn ${winner===you?'THẮNG':'THUA'}` : 'Hòa');
    });

    socket.on('errorMsg', (m) => alert(m));
});

// chỉ logout ở đây (login/register đã do auth.js lo)
$('btnLogout').addEventListener('click', () => {
    clearToken();
    socket?.disconnect();
    socket = null;
    roomId = null;
    board = Array.from({length: SIZE}, () => Array(SIZE).fill(''));
    drawBoard();
    renderAuthUI(null);
    alert('Đã logout!');
});

// init
(async () => {
    const me = await apiMe();
    renderAuthUI(me);
    drawBoard();
})();
