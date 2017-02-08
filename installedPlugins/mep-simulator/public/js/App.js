import Robot from './Robot';
import Terrain from './Terrain';

class App {
    constructor(telemetry, canvas, config) {
        let app = this;
        this.config = Object.assign({
            backgroundImageUrl: undefined,
            terrainWidth: 2000,
            terrainHeight: 3000,
            canvasHeight: 570,
            canvasWidth: 390,
        }, config);
        this.visual = {
            mouseX: 0,
            mouseY: 0
        };
        this.telemetry = telemetry;
        this.canvas = canvas;

        // Initialize canvas
        let canvasWidth = canvas.clientWidth || this.config.canvasWidth;
        let canvasHeight = canvas.clientHeight || this.config.canvasHeight;
        this.scaleWidth = canvasWidth / this.config.terrainWidth;
        this.scaleHeight = canvasHeight / this.config.terrainHeight;
        this.ctx = this.canvas.getContext('2d');
        this.ctx.scale(this.scaleWidth, this.scaleHeight);
        this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));

        // Initialize a few objects
        this.terrain = new Terrain(this.ctx, {
            backgroundImageUrl: this.config.backgroundImageUrl,
            terrainWidth: this.config.terrainWidth,
            terrainHeight: this.config.terrainHeight
        });
        this.robots = [];
        let bigRobot = new Robot(this.ctx, {
            name: 'big',
            terrainWidth: this.config.terrainWidth,
            terrainHeight: this.config.terrainHeight,
            stateChangedCallback: this.onRobotStateChanged.bind(this),
            positionChangedCallback: this.onRobotPositionChanged.bind(this),
            orientationChangedCallback: this.onRobotOrientationChanged.bind(this),
        });
        this.robots.push(bigRobot);


        // This is query for packet you want to listen
        // Format: data_[to]_[tag]
        telemetry.on('data_dash:big_MotionDriverSimulator', this.onPacketReceived.bind(this));

        // Start rendering
        this.render();
    }

    onMouseMove(event) {
        let rect = this.canvas.getBoundingClientRect();
        this.visual.mouseX = ((event.clientX - rect.left) / this.scaleWidth) | 0;
        this.visual.mouseY = ((event.clientY - rect.top) / this.scaleHeight) | 0;
        this.visual.mouseTerrainY = (this.visual.mouseX - this.config.terrainWidth / 2) | 0;
        this.visual.mouseTerrainX = (this.config.terrainHeight / 2 - this.visual.mouseY) | 0;
    }

    onPacketReceived(packet) {
        switch (packet.action) {
            case 'moveToPosition':
                this.robots[0].moveToPosition(packet.params.x, packet.params.y);
                break;

            default:
                console.error('Cannot resolve action:', packet.action);
                break;
        }
    }

    onRobotOrientationChanged(robot, orientation) {
        this.telemetry.send(
            'dash:' + robot.getName(),
            'core:' + robot.getName(),
            'MotionDriverSimulator',
            'orientationChanged', {
                orientation: orientation
            }
        );
    }

    onRobotStateChanged(robot, state) {
        this.telemetry.send(
            'dash:' + robot.getName(),
            'core:' + robot.getName(),
            'MotionDriverSimulator',
            'stateChanged', {
                state: state
            }
        );
    }

    onRobotPositionChanged(robot, x, y) {
        this.telemetry.send(
            'dash:' + robot.getName(),
            'core:' + robot.getName(),
            'MotionDriverSimulator',
            'positionChanged', {
                x: x,
                y: y
            }
        );
    }

    render() {
        // Redraw background
        this.terrain.draw();

        // Draw a robot
        this.drawRobots();

        // Draw mouse position
        this.drawMousePosition();

        // Request a new frame
        requestAnimationFrame(this.render.bind(this));
    }

    drawRobots() {
        for (let robot of this.robots) {
            robot.draw();
        }
    }

    drawMousePosition() {
        let text = '(' + this.visual.mouseTerrainX + ', ' + this.visual.mouseTerrainY + ')';

        this.ctx.font = '100px Helvetica';
        this.ctx.fillStyle = '#000000';
        this.ctx.fillText(text, this.visual.mouseX, this.visual.mouseY);
    }
}

module.exports = App;
