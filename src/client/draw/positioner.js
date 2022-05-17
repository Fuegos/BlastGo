import { Drawer } from "./drawer";

export class Positioner extends Drawer {
    constructor(parent, indentLeft, indentTop) {
        super(parent);
        this.indentLeft = indentLeft;
        this.indentTop = indentTop;
    }

    setPosition = (entity) => {
        entity.x = this.getParentX() + this.getParentWidth() * this.indentLeft;
        entity.y = this.getParentY() + this.getParentHeight() * this.indentTop; 
    }

    move = (entity, dX, dY) => {
        this.indentLeft += dX;
        this.indentTop += dY;
        this.setPosition(entity.getEntity());
    }

    getIndentLeft() {
        return this.indentLeft;
    }

    getIndentTop() {
        return this.indentTop;
    }
}