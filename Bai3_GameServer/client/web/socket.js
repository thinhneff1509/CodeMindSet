export function createSocketNS(ns = '/', room = null) {
    if (typeof io === 'undefined') return null;
    const socket = io(ns, { transports: ['websocket'] });
    socket.on('connect', () => {
        if (room) socket.emit('join', room);
    });
    // Cho Line98: server emit 'state'
    socket.on('state', (payload) => {
        document.dispatchEvent(new CustomEvent('server-state', { detail: payload }));
    });
    return socket;
}