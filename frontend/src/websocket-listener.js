const SockJs = require('sockjs-client');
const Stomp = require('stompjs');

let stompClient = null;

const createSockJs = () => new SockJs('/payroll');

function connect(registrations) {
    const socket = createSockJs();
    stompClient = Stomp.over(socket);
    stompClient.connect({}, () => {
        registrations.forEach(({ route, callback }) => {
            stompClient.subscribe(route, callback);
        });
    });
}

function disconnect() {
    if (stompClient) {
        stompClient.disconnect();
    }
}

module.exports = {
    connect, 
    disconnect
}
