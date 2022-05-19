export class Drawer {
    constructor(parent, drawSettings) {
        this.parent = parent;
        this.drawSettings = drawSettings;
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

    getScreen = () => {
        if(window.innerWidth < window.innerHeight) {
            return this.drawSettings.mobile;
        } else {
            return this.drawSettings.laptop;
        }
    }
}