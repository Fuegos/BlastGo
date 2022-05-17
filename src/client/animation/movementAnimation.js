import { HandlerAnimation } from "./handlerAnimation";

export class MovementAnimation extends HandlerAnimation {

    constructor(time, curIndentLeft, curIndentTop, goalIndentLeft, goalIndentTop) {
        super(time, true);
        this.vectorX = goalIndentLeft - curIndentLeft;
        this.vectorY = goalIndentTop - curIndentTop;
        this.goalIndentLeft = goalIndentLeft;
        this.goalIndentTop = goalIndentTop;
        this.completedIndentLeft = 0;
        this.completedIndentTop = 0;   
    }

    animate = (dt, entity) => {
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

            entity.getPositioner().move(entity, moveX, moveY);

        } else {
            this.completed();
            entity.getPositioner().move(
                entity,
                this.vectorX - this.completedIndentLeft,
                this.vectorY - this.completedIndentTop 
            );
        }
    }
}