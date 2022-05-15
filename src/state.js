export class State {
    constructor() {
        this.isDrawingAnimation = false;
    }

    drawAnimation = () => {
        this.isDrawingAnimation = true;
    }

    stopDrawAnimation = () => {
        this.isDrawingAnimation = false;
    }

    checkStateDrawingAnimation = () => this.isDrawingAnimation;
}