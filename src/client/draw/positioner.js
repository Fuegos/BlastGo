import { Drawer } from "./drawer";

export class Positioner extends Drawer {
    constructor(parent, drawSettings) {
        super(parent, drawSettings);
        this.changeIndentLeft = 0;
        this.changeIndentTop = 0;
    }

    setPosition = (entity) => {
        entity.x = this.getParentX() + this.getParentWidth() * this.getIndentLeft();
        entity.y = this.getParentY() + this.getParentHeight() * this.getIndentTop(); 
    }

    move = (entity, dX, dY) => {
        this.changeIndentLeft += dX;
        this.changeIndentTop += dY;
        this.setPosition(entity.getEntity());
    }

    getIndentLeft = () => {
        return this.getScreen().indentLeft + this.changeIndentLeft;
    }

    getIndentTop() {
        return this.getScreen().indentTop + this.changeIndentTop;
    }
}