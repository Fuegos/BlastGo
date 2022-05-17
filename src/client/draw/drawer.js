export class Drawer {
    constructor(parent) {
        this.parent = parent;
    }

    getParentX() {
        return this.parent ? this.parent.x : 0;
    }

    getParentY() {
        return this.parent ? this.parent.y : 0;
    }

    getParentWidth() {
        return this.parent ? this.parent.width : window.innerWidth; 
    } 

    getParentHeight() {
        return this.parent ? this.parent.height : window.innerHeight; 
    }
}