import { QueueAnimations } from "../animation/queueAnimations";

export class Entity {
    constructor(id, keyName, parent, indentTop, indentLeft) {
        this._id = id;
        this.keyName = keyName;
        this.parent = parent;
        this.indentTop = indentTop;
        this.indentLeft = indentLeft;
        this.queueAnimations = new QueueAnimations();
    }

    getQueueAnimations = () => this.queueAnimations;

    getIndentTop() {
        return this.indentTop;
    }

    getIndentLeft() {
        return this.indentLeft;
    }

    getId() {
        return this._id;
    }

    getKeyName() {
        return this.keyName;
    } 

    getParentWidth() {
        return this.parent ? this.parent.width : window.innerWidth; 
    } 

    getParentHeight() {
        return this.parent ? this.parent.height : window.innerHeight; 
    }

    getParentX() {
        return this.parent ? this.parent.x : 0;
    }

    getParentY() {
        return this.parent ? this.parent.y : 0;
    } 
}