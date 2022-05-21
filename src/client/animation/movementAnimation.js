import { HandlerAnimation } from "./handlerAnimation";

export class MovementAnimation extends HandlerAnimation {

    constructor(entity, time, isIntercept, curIndentLeft, curIndentTop, goalIndentLeft, goalIndentTop) {
        super(entity, time, isIntercept);
        this.vectorX = goalIndentLeft - curIndentLeft;
        this.vectorY = goalIndentTop - curIndentTop;
        this.goalIndentLeft = goalIndentLeft;
        this.goalIndentTop = goalIndentTop;
        this.completedIndentLeft = 0;
        this.completedIndentTop = 0;   
    }

    animate = (dt) => {
        let moveX = 0;
        let moveY = 0;

        if(Math.abs(this.completedIndentLeft) < Math.abs(this.vectorX)) {
            moveX = (dt / this.time) * this.vectorX;
        }

        if(Math.abs(this.completedIndentTop) < Math.abs(this.vectorY)) {
            moveY = (dt / this.time) * this.vectorY;
        }

        if(moveX || moveY) {
            this.completedIndentLeft += moveX;
            this.completedIndentTop += moveY;
            
            this.entity.getPositioner().move(this.entity, moveX, moveY);

        } else {
            this.completed();
            this.entity.getPositioner().move(
                this.entity,
                this.vectorX - this.completedIndentLeft,
                this.vectorY - this.completedIndentTop 
            );
        }
    }
}