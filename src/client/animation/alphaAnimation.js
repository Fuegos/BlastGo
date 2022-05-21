import { HandlerAnimation } from "./handlerAnimation";

export class AlphaAnimation extends HandlerAnimation {
    constructor(entity, time, isIntercept, isEmergence) {
        super(entity, time, isIntercept);
        this.completedTime = 0;
        if(isEmergence) {
            entity.getEntity().alpha = 0;
        }
        this.isEmergence = isEmergence;
    }

    getAlpha = (deltaAlpha) => {
        if(this.isEmergence) {
            return deltaAlpha;
        } else {
            return 1 - deltaAlpha;
        }
    }

    animate = (dt) => {
        let sprite = this.entity.getEntity();
        if(this.completedTime < this.time) {
            this.completedTime += dt;
            sprite.alpha = this.getAlpha(this.completedTime / this.time);
        } else {
            sprite.alpha = this.getAlpha(1);
            this.completed();
        }
    }
}