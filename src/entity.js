import { Sprite } from "pixi.js";

export class Entity {
    constructor(texture, valueFill) {
        this.sprite = new Sprite(texture, valueFill);
        this.originalWidth = texture.width;
        this.originalHeight = texture.height;
        this.valueFill = valueFill;
    }

    drawing = () => this.sprite;

    resize = (parentWidth = this.sprite.parent.width, parentHeight = this.sprite.parent.height) => {        
        this.sprite.width = Math.round(parentWidth * this.valueFill);
        let delta = this.sprite.width / this.originalWidth;
        this.sprite.height = Math.round(this.originalHeight * delta);

        console.log(parentWidth, parentHeight, delta, this.sprite.width, this.sprite.height);
    }
}