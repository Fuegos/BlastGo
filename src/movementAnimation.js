import { HandlerAnimation } from "./handlerAnimation";

export class MovementAnimation extends HandlerAnimation {

    constructor(entity, time, goalIndentLeft, goalIndentTop) {

        super(entity);
        this.vectorX = goalIndentLeft - entity.getIndentLeft();
        this.vectorY = goalIndentTop - entity.getIndentTop();
        this.goalIndentLeft = goalIndentLeft;
        this.goalIndentTop = goalIndentTop;
        this.completedIndentLeft = 0;
        this.completedIndentTop = 0;
        this.time = time;
        this.isCompleted = false;
    }

    completed = () => this.isCompleted = true;

    move = (dt) => {
        //console.log(this.vectorX, this.vercorY);
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

            this.entity.move(moveX, moveY);

        } else {
            this.completed();
            this.entity.move(
                this.vectorX - this.completedIndentLeft,
                this.vectorY - this.completedIndentTop 
            );
        }
    }

    getIsCompleted = () => this.isCompleted;
}