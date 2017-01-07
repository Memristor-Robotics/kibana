class Terrain {
    constructor(ctx, config = {}) {
        this.ctx = ctx;
        this.config = Object.assign({
            backgroundImageUrl: undefined,
            terrainWidth: undefined,
            terrainHeight: undefined
        }, config);

        // All visual parameters declare here
        this.visual = {
            backgroundImage: null
        };
    }

    draw() {
        let terrain = this;

        // If no image draw white rectangle
        if (this.config.backgroundImageUrl === undefined) {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillRect(0, 0, this.config.terrainWidth, this.config.terrainHeight);
            return;
        }

        // If there is an image draw it
        if (this.visual.backgroundImage === null) {
            this.visual.backgroundImage = new Image();
            this.visual.backgroundImage.onload = () => {
                terrain.draw();
            };
            this.visual.backgroundImage.src = this.config.backgroundImageUrl;
        } else {
            this.ctx.drawImage(
                this.visual.backgroundImage,
                0, 0, this.visual.backgroundImage.width, this.visual.backgroundImage.height,
                0, 0, this.config.terrainWidth, this.config.terrainHeight
            );
        }
    }
}

module.exports = Terrain;
