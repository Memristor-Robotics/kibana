import Connection from './Telemetry';
import Cookies from './Cookies';

class App {
    constructor(nodes) {
        let app = this;
        this.nodes = nodes;

        // Pull host from cookies and try to connect
        if (Cookies.get('mep-host') !== null) {
            nodes.host.value = Cookies.get('mep-host');
            this.connect();
        }


        // Enable connection on demand
        nodes.connect.addEventListener('click', function() {
            app.connect();
        });


        // Show nice status messages
        Connection.get().on('stateChanged', function (code, msg) {
            app.setStatus(code, msg);
        });
    }

    connect() {
        let hostValue = this.nodes.host.value;
        console.log('Connecting to', hostValue);
        Cookies.set('mep-host', hostValue, 30);

        this.setStatus(0, 'Connecting...')

        Connection.get().connect(hostValue);
    }

    setStatus(code, msg) {
        // Create image element
        let imageNode = document.createElement('i');
        imageNode.setAttribute('aria-hidden', 'true');
        imageNode.style.fontSize = '40px';
        switch (code) {
            case Connection.STATE_OPEN:
                imageNode.style.color = '#27ae60';
                imageNode.setAttribute('class', 'fa fa-check');
                break;

            case Connection.STATE_CONNECTING:
                imageNode.style.color = '#f39c12';
                imageNode.setAttribute('class', 'fa fa-exclamation-triangle');
                break;

            default:
                imageNode.style.color = '#c0392b';
                imageNode.setAttribute('class', 'fa fa-check-circle');
                break;
        }


        // Create text element
        let textNode = document.createElement('span');
        textNode.appendChild(document.createTextNode(msg));

        // Add to status
        this.nodes.status.innerHTML = '';
        this.nodes.status.appendChild(imageNode);
        this.nodes.status.appendChild(textNode);
    }
}

module.exports = App;