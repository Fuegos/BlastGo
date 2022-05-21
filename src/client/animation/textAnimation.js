import { HandlerAnimation } from "./handlerAnimation";

export class TextAnimation extends HandlerAnimation {
    constructor(entity, time, isIntercept, curValue, goalValue) {
        super(entity, time, isIntercept);

        this.goalValue = goalValue;
        this.curValue = curValue;
        this.completedValue = 0;
    }

    animate = (dt) => {
        let vectorValue = this.goalValue - this.curValue;

        if(Math.abs(this.completedValue) < Math.abs(vectorValue)) {
            let addValue = (dt / this.time) * vectorValue;
            this.completedValue += addValue;
            this.entity.updateValue(Math.round(this.curValue + this.completedValue));
        } else {
            this.completed();
            this.entity.updateValue(this.goalValue);
        }
    }
}