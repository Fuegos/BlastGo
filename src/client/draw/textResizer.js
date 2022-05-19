import { Resizer } from "./resizer";

export class TextResizer extends Resizer {
    constructor(parent, drawSettings) {
        super(parent, drawSettings);
    }

    getSize = () => this.getScreen().size;

    resize = (text) => {
        text.style = { 
            fontSize: Math.round(this.getParentWidth() * this.getSize()),
            fontFamily: "marvinFont",
            fill: 0xFFFFFF
        };
    }
}