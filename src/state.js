export class State {
    constructor() {
        this.isDrawingAnimation = false;
        this.isGameOver = false;
        this.isWinning = false;
        this.isChangeScene = false;
        this.isGame = true;
    }

    drawAnimation = () => {
        this.isDrawingAnimation = true;
    }

    stopDrawAnimation = () => {
        this.isDrawingAnimation = false;
    }

    gameOver = () => {
        this.isGameOver = true;
        this.isChangeScene = true;
        this.isGame = false;
    }

    winning = () => { 
        this.isWinning = true;
        this.isChangeScene = true;
        this.isGame = false;
    }

    resetGame = () => {
        this.isGameOver = false;
        this.isWinning = false;
        this.isChangeScene = true;
        this.isGame = true;
    }

    uncheck = () => this.isChangeScene = false;

    checkStateDrawingAnimation = () => this.isDrawingAnimation;

    checkGameOver = () => this.isGameOver;

    checkWinning = () => this.isWinning;

    checkChangeScene = () => this.isChangeScene;

    checkGame = () => this.isGame;
}