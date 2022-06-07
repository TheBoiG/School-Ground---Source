const ws = require('ws')
const WebSocket = class WebSocket {
    constructor(port) {
        this.port = port
        this.sokit = null;
        this.init()
        this.livinCallFn = []
        this.outCallFn = []
        this.messageFn = []
    }
    addLiveIn(fn) {
        this.livinCallFn.push(fn)
    }
    addClose(fn) {
        this.outCallFn.push(fn)
    }
    addMessage(fn) {
        this.messageFn.push(fn)
    }
    
    closeCall(socket, upgradeReq, key) {
        for (let fn of this.outCallFn) {
            fn(socket, upgradeReq, key)
        }
    }
    mesageCall(sokit, data) {
        for (let fn of this.messageFn) {
            fn(sokit, data)
        }
    }
    
    connection(socket, upgradeReq) {
    
    
        var url = upgradeReq.socket.remoteAddress + upgradeReq.url;
    
        var key = url.substr(1).split('/')[1];
        for (let fn of this.livinCallFn) {
            fn(socket, upgradeReq, key)
        }
        console.log(((socket.readyState)))
    
        socket.on('close', this.closeCall.bind(this));
        socket.on("message", this.mesageCall.bind(this, socket))
    }
    init() {
        this.sokit = new ws.Server({
            port: this.port,
            perMessageDeflate: false
        });
    
        this.sokit.on('connection', this.connection.bind(this))
    }
}

module.exports = WebSocket