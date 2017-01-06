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
            orientation: 0
          }
        };
        this.backgroundImage = null;

        let canvasWidth = canvas.clientWidth | this.config.canvasWidth;
        let canvasHeight = canvas.clientHeight | this.config.canvasHeight;

        // Initialize context
        this.ctx = canvas.getContext('2d');
        this.ctx.scale(canvasWidth / this.config.terrainWidth, canvasHeight / this.config.terrainHeight);

        // Render default params
        this.render();

        // Listen for polygon changes
        telemetry.on('data_dash:big_TerrainService_ObstacleAdded', (packet) => {
            app.visual.obstacles[packet.params.id] = packet.params;
            app.render();
        });
        telemetry.on('data_dash:big_TerrainService_ObstacleRemoved', (packet) => {
            if (app.visual.obstacles[packet.params.id] !== undefined) {
                delete app.visual.obstacles[packet.params.id];
                app.render();
            }
        });
        telemetry.on('data_dash:big_PositionEstimator_PositionChanged', (packet) => {
            app.visual.robot.x = packet.params.x;
            app.visual.robot.y = packet.params.y;
            app.render();
        });
    }

    render() {
        // Draw background
        this.drawBackground();

        // Draw obstacles
        this.drawObstacles();

        // Draw robot
        this.drawRobot();
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
        console.log(this.visual.robot);

        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        this.ctx.fillRect(
          this.visual.robot.y + this.config.terrainWidth / 2 - 250 / 2,
          this.config.terrainHeight / 2 - this.visual.robot.x - 250 / 2,
          250,
          250
        );
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
