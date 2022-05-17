import { MovementAnimation } from "./movementAnimation.js";
import { TextAnimation } from './textAnimation.js'

export class QueueAnimations {
    constructor() {
        this.animations = [];
    }

    push = (animation) => this.animations.push(animation);

    pushTextAnimation = (time, curValue, goalValue) => {
        this.push(
            new TextAnimation(time, curValue, goalValue)
        )
    }

    pushMovementAnimation = (time, curIndentLeft, curIndentTop, goalIndentLeft, goalIndentTop) => {
        this.push(
            new MovementAnimation(time, curIndentLeft, curIndentTop, goalIndentLeft, goalIndentTop)
        )
    }

    checkIntercept = () => this.animations.some(a => a.checkIntercept());
    
    extract = () => this.animations.shift();

    isNeedAnimate = () => this.animations.length;

    getFirstAnimation = () => this.isNeedAnimate() ? this.animations[0] : null;

    animate = (dt, entity) => {
        let animation = this.getFirstAnimation();

        console.log(this.animations.map(z => z));

        if(animation) {
            animation.animate(dt, entity);

            if(animation.checkCompleted()) {
                this.extract();
            }
        }
    }
}