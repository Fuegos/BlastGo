import { Entity } from "./entity";
import { Sprite } from "pixi.js";

export class SpriteEntity extends Entity {
    constructor(parent, indentTop, indentLeft, texture, valueFill) {
        
        super(parent, indentTop, indentLeft);

        this.sprite = new Sprite(texture);
        this.originalWidth = texture.width;
        this.originalHeight = texture.height;
        this.valueFill = valueFill;
    }

    getEntity = () => this.sprite;

    resize = () => {        
        this.sprite.width = Math.round(super.getParentWidth() * this.valueFill);
        let delta = this.sprite.width / this.originalWidth;
        this.sprite.height = Math.round(this.originalHeight * delta);
    }

    setPosition = () => {
        this.sprite.x = super.getParentX() + Math.round(super.getParentWidth() * this.indentLeft);
        this.sprite.y = super.getParentY() + Math.round(super.getParentHeight() * this.indentTop); 

        console.log(super.getParentX(), super.getParentWidth());
    }
}