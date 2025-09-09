import { authHeader } from '../auth.js';

const API_BASE = '/games/line98';

export async function newGame() {
    const res = await fetch(`${API_BASE}/new`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: '{}'
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function getGame(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
        headers: { ...authHeader() }
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

export async function move(gameId, from, to, room='solo') {
    const res = await fetch(`${API_BASE}/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({ gameId, from, to, room })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}
