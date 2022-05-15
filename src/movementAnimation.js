import { HandlerAnimation } from "./handlerAnimation";

export class MovementAnimation extends HandlerAnimation {

    constructor(entity, time, goalIndentLeft, goalIndentTop) {

        super(entity);
        this.vectorX = goalIndentLeft - entity.getIndentLeft();
        this.vercorY = goalIndentTop - entity.getIndentTop();
        this.goalIndentLeft = goalIndentLeft;
        this.goalIndentTop = goalIndentTop;
        this.time = time;
        this.isCompleted = false;
    }

    completed = () => this.isCompleted = true;

    move = (dt) => {
        this.entity.move(
            (dt / this.time) * this.vectorX,
            (dt / this.time) * this.vercorY
        )
        this.checkCompleted();
    }

    checkCompleted = () => {
        if(
            (this.entity.getIndentLeft() >= this.goalIndentLeft 
                || this.entity.getIndentLeft() <= this.goalIndentLeft) 
            && (this.entity.getIndentTop() >= this.goalIndentTop 
                || this.entity.getIndentTop <= this.goalIndentTop) 
        ) {
            //this.entity.x = this.goalX;
            //this.entity.y = this.goalY;
            this.completed();   
        }
    }

    getIsCompleted = () => this.isCompleted;
}