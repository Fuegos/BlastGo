import { Resizer } from "./resizer";

export class TextResizer extends Resizer {
    constructor(parent, fillSize) {
        super(parent);

        this.fillSize = fillSize;
    }

    resize = (text) => {
        text.style = { 
            fontSize: Math.round(this.getParentWidth() * this.fillSize),
            fontFamily: "marvinFont",
            fill: 0xFFFFFF
        };
    }
}