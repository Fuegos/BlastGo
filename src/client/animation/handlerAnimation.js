export class HandlerAnimation {
    constructor(time, isIntercept) {
        this.time = time;
        this.isCompleted = false;
        this.isIntercept = isIntercept;
    }

    completed = () => this.isCompleted = true;

    checkCompleted = () => this.isCompleted;

    checkIntercept = () => this.isIntercept;
} 