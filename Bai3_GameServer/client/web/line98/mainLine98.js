import { newGame, getGame, move } from './apiLine98';
import { Line98Canvas, renderNextColors } from './line98UI.js';
import { createSocketNS } from '../socket.js';
import { apiRegister, apiLogin, apiMe, getToken } from '../auth.js';

const $ = (id)=>document.getElementById(id);

// UI refs
const canvas  = $('board');
const scoreEl = $('score');
const nextEl  = $('next');
const btnNew  = $('btnNew');
const meEl    = $('me');
const gamePanel = $('gamePanel');


const ui = new Line98Canvas(canvas, onCellClick);
let current  = { id: null, board: null, nextColors: [], score: 0 };
let selected = null;
const room   = 'solo';

function renderAuthUI(user){
    if (user) {
        meEl.textContent = `Xin chào, ${user.username ?? 'player'}`;
        $('btnLogout').style.display = 'inline-block';
        gamePanel.style.display = '';
    } else {
        meEl.textContent = '';
        $('btnLogout').style.display = 'none';
        gamePanel.style.display = 'none';
    }
}

// ----- helpers -----
async function startGame() {
    if (!getToken()) { alert('Hãy đăng nhập trước.'); return; }
    createSocketNS('/line98', room); // chỉ tạo socket khi đã login
    await boot();
}

async function boot() {
    const g = await newGame();
    setGame(g);
}
function setGame(g) {
    current = g;
    ui.setBoard(g.board);
    renderNextColors(nextEl, g.nextColors);
    scoreEl.textContent = g.score;
    selected = null; ui.setSelected(null);
}
async function onCellClick(pos) {
    if (!getToken()) { alert('Hãy đăng nhập trước.'); return; }

    const val = current.board[pos.r][pos.c];
    if (selected == null) {
        if (val > 0) { selected = pos; ui.setSelected(pos); }
    } else {
        if (selected.r === pos.r && selected.c === pos.c) { selected = null; ui.setSelected(null); return; }
        try {
            const res = await move(current.id, selected, pos, room);
            setGame(res.game);
            if (res.gameOver) alert('Game Over!');
        } catch (e) {
            console.warn(e);
            if (val > 0) { selected = pos; ui.setSelected(pos); } else { ui.setSelected(selected); }
        }
    }
}

// ----- UI events -----
btnNew.onclick = startGame;

$('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = $('reg_username').value.trim();
    const p = $('reg_password').value;
    const n = $('reg_nickname').value.trim();
    try {
        await apiRegister(u, p, n);
        alert('Đăng ký thành công! Hãy đăng nhập.');
    } catch (err) { alert('Register failed: ' + err.message); }
});

$('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = $('login_username').value.trim();
    const p = $('login_password').value;
    try {
        await apiLogin(u, p);           // tự lưu token
        const me = await apiMe();       // lấy user để hiển thị
        renderAuthUI(me);
        await startGame();
    } catch (err) { alert('Login failed: ' + err.message); }
});

$('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('token');
    renderAuthUI(null);
    alert('Đã logout!');
});

// socket -> cập nhật UI
document.addEventListener('server-state', (e) => {
    const g = e.detail;
    if (g?.id) setGame(g);
});

// init
(async () => {
    const me = await apiMe();
    renderAuthUI(me);
    if (me) startGame();
})();
