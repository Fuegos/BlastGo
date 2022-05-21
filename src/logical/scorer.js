import { 
    GOAL_COUNT_MOVE, 
    SCORE_ONE_TILE,
    SCORE_ONE_MOVE, 
    GOAL_COUNT_SCORE
} from '../settings/constants'

export class Scorer {
    constructor() {
        this.currentScore = 0;
        this.restMove = GOAL_COUNT_MOVE;
    }

    accrueScore = (group) => {
        this.currentScore += SCORE_ONE_TILE * Math.pow(group, 2);
    }

    resetMoves = () => {
        this.currentScore += SCORE_ONE_MOVE * this.restMove;
        this.restMove = 0;
    }

    getCurrentScore = () => this.currentScore;

    getRestMove = () => this.restMove;

    takeAwayMove = () => this.restMove--;

    getProgress = () => this.roundToOne(this.currentScore / GOAL_COUNT_SCORE);

    roundToOne = (value) => value > 1 ? 1 : value;

    checkGoal = () => this.currentScore >= GOAL_COUNT_SCORE;

    checkLose = () => this.currentScore < GOAL_COUNT_SCORE && this.restMove === 0;
}