import { Entity } from "./entity";
import { Sprite } from "pixi.js";
import { SpriteResizer } from "./spriteResizer";

export class SpriteEntity extends Entity {
    constructor(id, keyName, parent, texture, drawSettings) {
        
        super(id, keyName, parent, drawSettings);

        this.sprite = new Sprite(texture);
        this.isClicked = false;

        this.sprite.interactive = true;
        this.sprite.on('click', this.clicking);
        this.sprite.on('touchend', this.clicking);


        this.resizer = new SpriteResizer(parent, texture.width, texture.height, drawSettings);
    }

    getEntity = () => this.sprite; 

    getResizer = () => this.resizer;

    clicking = () => this.isClicked = true;

    unclicking = () => this.isClicked = false;

    checkClicked = () => this.isClicked;

    getX = () => this.sprite.x;

    getY = () => this.sprite.y;

    getWidth = () => this.sprite.width;

    getHeight = () => this.sprite.height;
}