import { Resizer } from "./resizer";

export class SpriteResizer extends Resizer {
    constructor(parent, originalWidth, originalHeight, drawSettings) {
        super(parent, drawSettings);

        this.originalWidth = originalWidth;
        this.originalHeight = originalHeight;
    }

    getValueFill = () => this.getScreen().valueFill;

    resize = (sprite) => {
        sprite.width = Math.round(this.getParentWidth() * this.getValueFill());
        let delta = sprite.width / this.originalWidth;
        sprite.height = Math.round(this.originalHeight * delta);
    }
}