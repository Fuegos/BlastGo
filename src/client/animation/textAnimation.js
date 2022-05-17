import { HandlerAnimation } from "./handlerAnimation";

export class TextAnimation extends HandlerAnimation {
    constructor(time, curValue, goalValue) {
        super(time, false);

        this.goalValue = goalValue;
        this.curValue = curValue;
        this.completedValue = 0;
    }

    animate = (dt, entity) => {
        let vectorValue = this.goalValue - this.curValue;

        if(Math.abs(this.completedValue) < Math.abs(vectorValue)) {
            let addValue = (dt / this.time) * vectorValue;
            this.completedValue += addValue;
            entity.updateValue(Math.round(this.curValue + this.completedValue));
        } else {
            this.completed();
            entity.updateValue(this.goalValue);
        }
    }
}