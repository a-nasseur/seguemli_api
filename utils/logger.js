const EventEmitter = require('events');

class Logger extends EventEmitter {
    log(data) {
        this.emit('userCreated', data);
    }
}

module.exports = Logger;