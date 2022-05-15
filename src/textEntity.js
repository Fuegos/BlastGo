import { Text } from "pixi.js"
import { Entity } from "./entity";

export class TextEntity extends Entity {
    constructor(id, keyName, parent, indentTop, indentLeft, value, size) {
        super(id, keyName, parent, indentTop, indentLeft);

        this.text = new Text(
            value, 
            {
                fontFamily: "marvinFont",
                fill: 0xFFFFFF,
                fontSize: size
            }
        );
    }

    getEntity = () => this.text;

    resize = () => {

    }

    setPosition = () => {
        this.text.x = super.getParentX() + Math.round(super.getParentWidth() * this.indentLeft);
        this.text.y = super.getParentY() + Math.round(super.getParentHeight() * this.indentTop); 
    }
}