import { Loader } from "pixi.js";


export class StoreTextures {
    constructor() {
        this.loader = new Loader();
    }

    build = () => new Promise((resolve, reject) => {
        this.loader
        .add([
            {name: "blockBlue", url: "assets/block_blue.png"},
            {name: "blockGreen", url: "assets/block_green.png"},
            {name: "blockPurple", url: "assets/block_purple.png"},
            {name: "blockRed", url: "assets/block_red.png"},
            {name: "blockYellow", url: "assets/block_yellow.png"},
            {name: "bonusBomb", url: "assets/bonus_bomb.png"},
            {name: "bonusChange", url: "assets/bonus_change.png"},
            {name: "bonusFull", url: "assets/bonus_full.png"},
            {name: "gameField", url: "assets/game_field.png"},
            {name: "money", url: "assets/money.png"},
            {name: "pause", url: "assets/pause.png"},
            {name: "progressBack", url: "assets/progress_back.png"},
            {name: "progressFront", url: "assets/progress_front.png"},
            {name: "score", url: "assets/score.png"}
        ])
        .load(() => resolve())
    });
        
    getTexture = (name) => this.loader.resources[name].texture;
}