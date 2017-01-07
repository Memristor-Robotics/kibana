/**
 * Very basic implementation Node.js's EventEmitter for browser
 *
 * @author Darko Lukic <lukicdarkoo@gmail.com>
 * @see {@link https://nodejs.org/api/events.html|Node.js's EventEmitter}
 * @example
 * class Worker extends EventEmitter {
 *  constructor() {
 *      super();
 *      // Do stuff
 *      this.emit('calculationFinished', result);
 *  }
 * }
 *
 * let worker = new Worker();
 * worker.on('calculationFinished', (result) => {
 *      // I have result here :)
 * });
 */
class EventEmitter {
    constructor() {
        this.callbacks = {};
    }

    /**
     * Synchronously calls each of the listeners
     * @param eventName - Event identifier which will be used to call all callback functions
     */
    emit(eventName) {
        // Export params
        let params = [];
        for (let i = 1; i < arguments.length; i++) {
            params.push(arguments[i]);
        }

        // Call all callbacks
        if (this.callbacks[eventName] !== undefined) {
            for (let callback of this.callbacks[eventName]) {
                callback(...params);
            }
        }
    }

    /**
     * Adds the listener function to the end of the listeners array for the event named eventName
     * @param eventName - Event identifier which will be used to call all callback functions
     * @param callback - Callback function which will be called on event
     */
    on(eventName, callback) {
        if (this.callbacks[eventName] === undefined) {
            this.callbacks[eventName] = [];
        }

        this.callbacks[eventName].push(callback);
    }
}


/**
 * Singleton class listen for packets from MEP server
 * @author Darko Lukic <lukicdarkoo@gmail.com>
 * @example
 * let telemetry = Telemetry.get();
 * telemetry.on('stateChanged', (code, message) => {});
 * telemetry.on('data_core:big_MotionDriverSimulator_moveToPosition', (data) => {});
 */
class Telemetry extends EventEmitter {
    static get STATE_CONNECTING() { return 0; }
    static get STATE_OPEN() { return 1; }
    static get STATE_CLOSING() { return 2; }
    static get STATE_CLOSED() { return 3; }
    static get STATE_ERROR() { return 3; }

    /**
     * Get instance of Telemetry class
     * @returns {Telemetry}
     */
    static get() {
        if (Telemetry.instance === undefined) {
            Telemetry.instance = new Telemetry();
        }
        return Telemetry.instance;
    }

    /**
     * Connect to MEP server
     * @param host - Server IP and port, eg. ws://127.0.0.1:1116
     */
    connect(host) {
        let telemetry = this;

        this.ws = new WebSocket(host);
        this.emit('stateChanged', Telemetry.STATE_CONNECTING, 'Connecting...');

        // On Message received
        this.ws.onmessage = function(message) {
            let parsedData = JSON.parse(message.data);

            telemetry.emit(
                'data_' + parsedData.to + '_' +  parsedData.tag + '_' + parsedData.action,
                parsedData
            );

            telemetry.emit(
                'data_' + parsedData.to + '_' +  parsedData.tag,
                parsedData
            );
        };

        // On State changed
        this.ws.onclose = () => {
            telemetry.emit('stateChanged', Telemetry.STATE_CLOSED, 'Connection is closed...');
        };
        this.ws.onopen = () => {
            telemetry.emit('stateChanged', Telemetry.STATE_OPEN, 'Connection is live...');

            telemetry.ws.send(JSON.stringify({
                'from': 'dash:*',
                'to': 'core:*',
                'tag': 'Handshake',
                'action': 'init',
                'params': ''
            }));
        };
        this.ws.onerror = () => {
            telemetry.emit('stateChanged', Telemetry.STATE_ERROR, 'Error during communication...');
        };
    }

    getState() {
        return this.ws.readyState;
    }

    /**
     * Send packet to core
     * @param from - Who is sending, eg. dash:big
     * @param to - Who should receive, eg. core:big
     * @param tag - Modul name for collection of actions, eg. MotionDriverSimulator
     * @param action - Name of action, usually correspond to function name, eg. moveToPosition
     * @param params - Parameters important for action
     */
    send(from, to, tag, action, params) {
        this.ws.send(JSON.stringify({
            'from': from,
            'to': to,
            'tag': tag,
            'action': action,
            'params': params
        }));
    }
}

module.exports = Telemetry;