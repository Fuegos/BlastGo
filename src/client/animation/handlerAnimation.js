export class HandlerAnimation {
    constructor(entity, time, isIntercept) {
        this.entity = entity;
        this.time = time;
        this.isCompleted = false;
        this.isIntercept = isIntercept;
    }

    completed = () => this.isCompleted = true;

    checkCompleted = () => this.isCompleted;

    checkIntercept = () => this.isIntercept;
} 