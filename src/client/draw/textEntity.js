import { Text } from "pixi.js"
import { Entity } from "./entity";
import { TextResizer } from "./textResizer";

export class TextEntity extends Entity {
    constructor(id, keyName, parent, indentLeft, indentTop, textValue, value, fillSize) {
        super(id, keyName, parent, indentLeft, indentTop);

        this.value = value;
        this.textValue = textValue;
        this.resizer = new TextResizer(parent, fillSize)
        this.text = new Text(textValue.replace(/&value&/, value));
    }

    getEntity = () => this.text;

    getResizer = () => this.resizer;

    updateValue = (value) => {
        this.value = value;
        this.text.text = this.textValue.replace(/&value&/, value);
    }
    
    getValue = () => this.value;
}