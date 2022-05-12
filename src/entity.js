export class Entity {
    constructor(parent, indentTop, indentLeft) {
        this.parent = parent;
        this.indentTop = indentTop;
        this.indentLeft = indentLeft;
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