import { Positioner } from "./positioner";

export class Entity {
    constructor(id, keyName, parent, indentLeft, indentTop) {
        this._id = id;
        this.keyName = keyName;
        this.parent = parent;
        this.positioner = new Positioner(parent, indentLeft, indentTop);
    }

    getPositioner = () => this.positioner;

    getId = () => this._id;

    getKeyName = () => this.keyName;
}