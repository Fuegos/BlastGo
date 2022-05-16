import { Entity } from "./entity";
import { Sprite } from "pixi.js";

export class SpriteEntity extends Entity {
    constructor(id, keyName, parent, indentTop, indentLeft, texture, valueFill) {
        
        super(id, keyName, parent, indentTop, indentLeft);

        this.sprite = new Sprite(texture);
        this.isClicked = false;

        this.sprite.interactive = true;
        this.sprite.on('click', this.clicking);

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
        this.sprite.x = super.getParentX() + super.getParentWidth() * this.indentLeft;
        this.sprite.y = super.getParentY() + super.getParentHeight() * this.indentTop; 
    }

    move = (dX, dY) => {
        this.indentLeft += dX;
        this.indentTop += dY;
        this.setPosition();
    }

    clicking = () => this.isClicked = true;

    unclicking = () => this.isClicked = false;

    checkClicked = () => this.isClicked;

    getX = () => this.sprite.x;

    getY = () => this.sprite.y;

    getHeight = () => this.sprite.height;

    getWidth = () => this.sprite.width;
}