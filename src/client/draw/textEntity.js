import { Text } from "pixi.js"
import { Entity } from "./entity";
import { TextResizer } from "./textResizer";

export class TextEntity extends Entity {
    constructor(id, keyName, parent, textValue, value, drawSetings) {
        super(id, keyName, parent, drawSetings);

        this.value = value;
        this.textValue = textValue;
        this.resizer = new TextResizer(parent, drawSetings)
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