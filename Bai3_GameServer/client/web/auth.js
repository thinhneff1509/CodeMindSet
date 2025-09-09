const API = '/auth';

async function parseRes(res) {
    let data = null;
    try { data = await res.json(); } catch(_) {}
    if (!res.ok) {
        const msg = data?.message || res.statusText || `HTTP ${res.status}`;
        throw new Error(Array.isArray(msg) ? msg.join(', ') : msg);
    }
    return data;
}

export async function apiRegister(username, password, nickname) {
    const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password, nickname })
    });
    return parseRes(res);
}

export async function apiLogin(username, password) {
    const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
    });
    // Có nơi trả { access_token }, có nơi trả { token }
    const data = await parseRes(res);
    const token = data.access_token || data.token;
    if (!token) throw new Error('No token returned from server');
    saveToken(token);
    return data;
}

export async function apiMe() {
    // Mặc định /user/me, nếu 404 sẽ decode JWT để lấy username.
    const t = getToken();
    if (!t) return null;

    try {
        const res = await fetch('/user/me', { headers: { ...authHeader() } });
        if (res.status === 404) throw new Error('no /user/me');
        const data = await parseRes(res);
        return data;
    } catch {
        // decode JWT
        try {
            const [, payload] = t.split('.');
            const json = JSON.parse(atob(payload.replace(/-/g,'+').replace(/_/g,'/')));
            return { username: json.username || json.sub || 'me' };
        } catch {
            return null;
        }
    }
}

export function saveToken(token){ localStorage.setItem('token', token); }
export function getToken(){ return localStorage.getItem('token'); }
export function clearToken(){ localStorage.removeItem('token'); }
export function authHeader(){
    const t = getToken();
    return t ? { Authorization: `Bearer ${t}` } : {};
}

// UI glue
const $ = (id)=>document.getElementById(id);
const me = $('me');
const btnLogout = $('btnLogout');
const gamePanel = $('gamePanel');

export function renderAuthUI(user){
    if (user) {
        me.textContent = `Xin chào, ${user.username ?? 'player'}`;
        btnLogout.style.display = 'inline-block';
        gamePanel.style.display = '';
    } else {
        me.textContent = '';
        btnLogout.style.display = 'none';
        gamePanel.style.display = 'none';
    }
}

// Wire sự kiện cho login + register + logout
async function initAuthUI() {
    $('registerForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = $('reg_username').value.trim();
        const password = $('reg_password').value;
        const nickname = $('reg_nickname').value.trim();
        try {
            await apiRegister(username, password, nickname);
            alert('Đăng ký thành công! Hãy đăng nhập.');
        } catch (err) {
            alert('Register failed: ' + err.message);
        }
    });

    $('loginForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = $('login_username').value.trim();
        const password = $('login_password').value;
        try {
            await apiLogin(username, password);
            const user = await apiMe();
            renderAuthUI(user);
            alert('Đăng nhập thành công!');
        } catch (err) {
            alert('Login failed: ' + err.message);
        }
    });

    btnLogout?.addEventListener('click', () => {
        clearToken();
        renderAuthUI(null);
        alert('Đã logout!');
    });

    // Nếu đã có token (refresh page)
    const user = await apiMe();
    renderAuthUI(user);
}

initAuthUI();
