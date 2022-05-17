import { Resizer } from "./resizer";

export class SpriteResizer extends Resizer {
    constructor(parent, valueFill, originalWidth, originalHeight) {
        super(parent);

        this.valueFill = valueFill;
        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
    }

    resize = (sprite) => {
        //console.log("Before " + sprite.width + " " + sprite.height);
        sprite.width = Math.round(this.getParentWidth() * this.valueFill);
        let delta = sprite.width / this.originalWidth;
        sprite.height = Math.round(this.originalHeight * delta);
        //console.log("After " + sprite.width + " " + sprite.height);
    }
}