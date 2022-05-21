import { HandlerAnimation } from "./handlerAnimation";

export class ProgressAnimation extends HandlerAnimation {
    constructor(entity, time, isIntercept, curValue, goalValue) {
        super(entity, time, isIntercept);
        this.curValue = curValue;
        this.goalValue = goalValue;
        this.completedValue = 0;
    }

    drawProgress = (spriteProgress, valueProgress) => {
        spriteProgress.mask.clear();
        spriteProgress.mask.beginFill();
        spriteProgress.mask.drawRoundedRect(
            this.entity.getX(), 
            this.entity.getY(), 
            valueProgress * this.entity.getWidth(), 
            this.entity.getHeight(),
            20);
        spriteProgress.mask.endFill();
    }

    animate = (dt) => {
        let vectorValue = this.goalValue - this.curValue;

        if(Math.abs(this.completedValue) < Math.abs(vectorValue)) {
            let addValue = (dt / this.time) * vectorValue;
            this.completedValue += addValue;
            this.drawProgress(this.entity.getEntity(), this.curValue + this.completedValue)
        } else {
            this.completed();
            this.drawProgress(this.entity.getEntity(), this.goalValue);
        }
    }
}