export class State {
    constructor() {
        this.isInterceptAnimation = false;
        this.isGameOver = false;
        this.isWinning = false;
        this.isChangeScene = false;
        this.isGame = true;
    }

    interceptAnimation = () => {
        this.isInterceptAnimation = true;
    }

    stopInterceptAnimation = () => {
        this.isInterceptAnimation = false;
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

    checkInterceptAnimation = () => this.isInterceptAnimation;

    checkGameOver = () => this.isGameOver;

    checkWinning = () => this.isWinning;

    checkChangeScene = () => this.isChangeScene;

    checkGame = () => this.isGame;
}