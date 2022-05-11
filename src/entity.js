import { Sprite } from "pixi.js";


export class Entity {
    constructor(texture, valueFill, parent, indentTop, indentLeft) {
        this.sprite = new Sprite(texture, valueFill);
        this.originalWidth = texture.width;
        this.originalHeight = texture.height;

        this.parent = parent;

        this.valueFill = valueFill;
        this.indentTop = indentTop;
        this.indentLeft = indentLeft;
    }

    getSprite = () => this.sprite;

    getParentWidth = () => this.parent ? this.parent.width : window.innerWidth; 

    getParentHeight = () => this.parent ? this.parent.height : window.innerHeight; 

    getParentX = () => this.parent ? this.parent.x : 0;

    getParentY = () => this.parent ? this.parent.y : 0;

    resize = () => {        
        this.sprite.width = Math.round(this.getParentWidth() * this.valueFill);
        let delta = this.sprite.width / this.originalWidth;
        this.sprite.height = Math.round(this.originalHeight * delta);

        //console.log(this.sprite.width, this.sprite.height, this.getParentWidth(), this.sprite.texture.textureCacheIds[0]);
    }

    setPosition = () => {
        this.sprite.x = this.getParentX() + Math.round(this.getParentWidth() * this.indentLeft);
        this.sprite.y = this.getParentY() + Math.round(this.getParentHeight() * this.indentTop); 

        //console.log(this.sprite.x, this.sprite.texture.textureCacheIds[0]);
    }
}