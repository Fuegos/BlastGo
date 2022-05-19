export class QueueAnimations {
    constructor() {
        this.animations = [];
    }

    pushAsync = (animation) => {
        if(this.animations.length === 0) {
            this.animations.push([]); 
        }

        this.animations[0].push(animation);
    }

    pushNewGroup = (animations) => this.animations.push(animations);
    
    extract = () => this.animations.shift();

    isNeedAnimate = () => this.animations.length !== 0;

    animate = (dt) => {
        if(this.isNeedAnimate()) {
            let performingAnimations = this.animations[0].filter(
                a => !a.checkCompleted()
            );
            
            if(performingAnimations.length) {
                performingAnimations.forEach(a => a.animate(dt));
            } else {
                this.extract();
            }
        }
    }

    checkIntercept = () => this.animations.some(
        group => group.some(
            animate => animate.checkIntercept()
        )
    );
}