class Robot {
    static get DIRECTION_FORWARD() { return 1; }
    static get DIRECTION_BACKWARD() { return -1; }
    static get STATE_IDLE() { return 1; }
    static get STATE_STUCK() { return 2; }
    static get STATE_MOVING() { return 3; }
    static get STATE_ROTATING() { return 4; }
    static get STATE_ERROR() { return 5; }

    constructor(ctx, config = {}) {
        // Apply default configs if configs doesn't contain parameter
        this.config = Object.assign({
            name: 'big',
            width: 280,
            height: 280,
            startX: -1300,
            startY: 0,
            tolerance: 20,
            refreshPeriod: 20,
            initialSpeed: 130,
            initialAngle: 90,
            stateChangedCallback: (() => {}),
            positionChangedCallback: (() => {})
        }, config);

        // Set default parameters
        this.ctx = ctx;
        this.visual = {
            x: this.config.startX,
            y: this.config.startY,
            angle: this.config.initialAngle,
            destinationX: this.config.startX,
            destinationY: this.config.startY,
            stepSizeMul: 1,
        };
        this.setSpeed(this.config.initialSpeed);
    }

    getName() {
        return this.config.name;
    }

    setPosition(x, y) {
        // Send notification. Don't afraid of `x | 0` it's only fast double to int conversion
        if (x | 0 !== this.visual.x | 0 || y | 0 !== this.visual.y | 0) {
            this.config.positionChangedCallback(this, x | 0, y | 0);
        }

        // Set visual params
        this.visual.x = x;
        this.visual.y = y;
    }

    setSpeed(speed) {
        // Numbers 20 & 6 are corrective factors, empirically defined
        this.visual.moveStepSizeMul = (speed / 255) * 20;
        this.visual.rotateStepSizeMul = (speed / 255) * 5;
    }

    setAngle(angle) {
        this.visual.angle = angle;
    }

    setRefreshPeriod() {
        this.config.refreshPeriod = 20;
    }

    moveToPosition(x, y, direction) {
        let robot = this;

        let startX = this.visual.x;
        let startY = this.visual.y;
        let destinationAngle = Math.round(Math.atan2((x - startX),  (y - startY)) * (180 / Math.PI));
        let moveStepSizeX = this.visual.moveStepSizeMul * Math.abs(Math.sin(destinationAngle * (Math.PI / 180)));
        let moveStepSizeY = this.visual.moveStepSizeMul * Math.abs(Math.cos(destinationAngle * (Math.PI / 180)));

        let determineY = (tempX) => { return ((y - startY) / (x - startX)) * (tempX - startX) + startY; };
        let determineX = (tempY) => { return (startX * y - x * startY + tempY * (x - startX)) / (y - startY); };
        let move = () => {
            let newX;
            let newY;
            if (moveStepSizeX > moveStepSizeY) {
                newX = robot.visual.x + moveStepSizeX * ((robot.visual.x > x) ? -1 : 1);
                newY = determineY(newX);
            } else {
                newY = robot.visual.y + moveStepSizeY * ((robot.visual.y > y) ? -1 : 1);
                newX = determineX(newY);
            }

            if (Math.sqrt(Math.pow(x - newX, 2) + Math.pow(y - newY, 2)) <= robot.config.tolerance) {
                robot.config.stateChangedCallback(robot, Robot.STATE_IDLE);
            } else {
                robot.setPosition(newX, newY);
                setTimeout(move, robot.config.refreshPeriod);
            }
        };

        this.rotateTo(destinationAngle, move);
        robot.config.stateChangedCallback(robot, Robot.STATE_MOVING);
    }

    rotateTo(angle, callback) {
        let robot = this;

        let rotate = () => {
            let newAngle = robot.visual.angle + this.visual.rotateStepSizeMul * ((robot.visual.angle > angle) ? -1 : 1);
            robot.setAngle(newAngle);

            if (Math.abs(angle - newAngle) > this.visual.rotateStepSizeMul) {
                setTimeout(rotate, robot.config.refreshPeriod);
            } else {
                if (callback !== undefined) {
                    callback();
                } else {
                    robot.config.stateChangedCallback(robot, Robot.STATE_IDLE);
                }
            }
        };
        rotate();
        robot.config.stateChangedCallback(robot, Robot.STATE_ROTATING);
    }

    draw() {
        let x = this.visual.y + this.config.terrainWidth / 2;
        let y = this.config.terrainHeight / 2 - this.visual.x;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((90 - this.visual.angle) * (Math.PI / 180));

        // Draw robot body
        this.ctx.fillStyle = '#e74c3c';
        this.ctx.fillRect(
            - this.config.width / 2,
            - this.config.height / 2,
            this.config.width,
            this.config.height
        );

        // Draw robot front
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(
            - this.config.width / 2,
            - this.config.height / 2,
            this.config.width,
            20
        );

        this.ctx.restore();
    }
}

module.exports = Robot;
