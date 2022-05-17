import { Text } from "pixi.js"
import { Entity } from "./entity";

export class TextEntity extends Entity {
    constructor(id, keyName, parent, indentTop, indentLeft, textValue, value, size) {
        super(id, keyName, parent, indentTop, indentLeft);

        this.value = value;
        this.textValue = textValue;
        this.text = new Text(
            textValue.replace(/&value&/, value), 
            {
                fontFamily: "marvinFont",
                fill: 0xFFFFFF,
                fontSize: size
            }
        );
    }

    getEntity = () => this.text;

    updateValue = (value) => {
        this.value = value;
        this.text.text = this.textValue.replace(/&value&/, value);
    }
    
    getValue = () => this.value;

    resize = () => {

    }

    setPosition = () => {
        this.text.x = super.getParentX() + Math.round(super.getParentWidth() * this.indentLeft);
        this.text.y = super.getParentY() + Math.round(super.getParentHeight() * this.indentTop); 
    }
}