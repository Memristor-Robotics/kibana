class App {
    constructor(telemetry, canvas, config = {}) {
        let app = this;

        this.config = Object.assign({
            canvasWidth: 390,
            canvasHeight: 570,
            terrainWidth: 2000,
            terrainHeight: 3000,
            backgroundImageUrl: undefined
        }, config);

        this.visual = {
            obstacles: {},
            robot: {
                x: 0,
                y: 0,
                width: 200,
                height: 200,
                orientation: 0,
                hazardObstacleDistance: 200
            },
            targets: []
        };
        this.backgroundImage = null;

        let canvasWidth = canvas.clientWidth | this.config.canvasWidth;
        let canvasHeight = canvas.clientHeight | this.config.canvasHeight;

        // Initialize context
        this.ctx = canvas.getContext('2d');
        this.ctx.scale(canvasWidth / this.config.terrainWidth, canvasHeight / this.config.terrainHeight);


        // Event: Obstacle added
        telemetry.on('data_dash:big_TerrainService_ObstacleAdded', (packet) => {
            if (packet.params === undefined) return;

            app.visual.obstacles[packet.params.id] = packet.params;
            app.render();
        });

        // Event: Obstacle removed
        telemetry.on('data_dash:big_TerrainService_ObstacleRemoved', (packet) => {
            if (packet.params === undefined) return;

            if (app.visual.obstacles[packet.params.id] !== undefined) {
                delete app.visual.obstacles[packet.params.id];
                app.render();
            }
        });

        // Event: Position changed
        telemetry.on('data_dash:big_PositionService_PositionChanged', (packet) => {
            if (packet.params === undefined) return;

            app.visual.robot.x = packet.params.x;
            app.visual.robot.y = packet.params.y;
            app.render();
        });

        // Event: Orientation changed
        telemetry.on('data_dash:big_PositionService_OrientationChanged', (packet) => {
            if (packet.params === undefined) return;

            app.visual.robot.orientation = packet.params.orientation;
            app.render();
        });

        // Event: Target queue changed
        telemetry.on('data_dash:big_MotionService_TargetQueueChanged', (packet) => {
            if (packet.params === undefined) return;

            app.visual.targets = packet.params;

            // Add start target
            app.visual.targets.unshift({
                point: { x: this.visual.robot.x, y: this.visual.robot.y },
                params: { }
            });
            app.render();
        });

        // Event: HazardObstacleDistance set
        telemetry.on('data_dash:big_MotionService_HazardObstacleDistanceSet', (packet) => {
            if (packet.params === undefined) return;

            app.visual.robot.hazardObstacleDistance = packet.params.hazardObstacleDistance;

            app.render();
        });

        // Make background ready
        this.drawBackground();
    }

    render() {
        // Draw background
        this.drawBackground();

        // Draw obstacles
        this.drawObstacles();

        // Draw robot
        this.drawRobot();

        // Draw targets
        this.drawTargets();
    }

    _genX(y) { return (y + this.config.terrainWidth / 2); }
    _genY(x) { return (this.config.terrainHeight / 2 - x); }

    drawTargets() {
        let targets = this.visual.targets;
        for (let i = 0; i < targets.length; i++) {
            this.ctx.fillStyle = 'rgb(0, 255, 0)';

            // Draw target rect
            this.ctx.fillRect(
                this._genX(targets[i].point.y) - 50,
                this._genY(targets[i].point.x) - 50,
                100, 100
            );

            // Draw line between targets
            if (i > 0) {
                this.ctx.strokeStyle = 'rgb(100, 255, 100)';
                this.ctx.lineWidth = 10;
                this.ctx.beginPath();
                this.ctx.moveTo(this._genX(targets[i - 1].point.y), this._genY(targets[i - 1].point.x));
                this.ctx.lineTo(this._genX(targets[i].point.y), this._genY(targets[i].point.x));
                this.ctx.stroke();
            }
        }
    }

    drawBackground() {
        let app = this;

        // If no image draw black rect
        if (this.config.backgroundImageUrl === undefined) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(0, 0, this.config.terrainWidth, this.config.terrainHeight);
            return;
        }

        // If there is an image draw it
        if (this.backgroundImage === null) {
            this.backgroundImage = new Image();
            this.backgroundImage.onload = () => {
                app.drawBackground();
            };
            this.backgroundImage.src = this.config.backgroundImageUrl;
        } else {
            this.ctx.drawImage(
                this.backgroundImage,
                0, 0, this.backgroundImage.width, this.backgroundImage.height,
                0, 0, this.config.terrainWidth, this.config.terrainHeight
            );
        }
    }

    drawRobot() {
        let x = this._genX(this.visual.robot.y);
        let y = this._genY(this.visual.robot.x);

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((90 - this.visual.robot.orientation) * (Math.PI / 180));

        // Draw robot body
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        this.ctx.fillRect(
            - this.visual.robot.width / 2,
            - this.visual.robot.height / 2,
            this.visual.robot.width,
            this.visual.robot.height
        );

        // Draw hazard circle
        this.ctx.strokeStyle = 'rgb(255, 0, 0)';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.visual.robot.hazardObstacleDistance, 0, 2 * Math.PI);
        this.ctx.stroke();

        this.ctx.restore();

    }

    drawObstacles() {
        for (let key in this.visual.obstacles) {
            if (this.visual.obstacles.hasOwnProperty(key)) {
                this.drawPolygon(this.visual.obstacles[key].points);
            }
        }
    }

    drawPolygon(polygon) {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.beginPath();
        this.ctx.moveTo(polygon[0].y + this.config.terrainWidth / 2, this.config.terrainHeight / 2 - polygon[0].x);

        for (let i = 1; i < polygon.length; i++) {
            let point = polygon[i];
            this.ctx.lineTo(point.y + this.config.terrainWidth / 2, this.config.terrainHeight / 2 - point.x);
        }

        this.ctx.closePath();
        this.ctx.fill();
    }

}

module.exports = App;
