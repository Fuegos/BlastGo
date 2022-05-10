import { Loader } from "pixi.js";


export class StoreTextures {
    constructor() {
        this.loader = new Loader();
    }

    build = () => new Promise((resolve, reject) => {
        this.loader
        .add([
            {name: "block_blue", url: "assets/block_blue.png"},
            {name: "block_green", url: "assets/block_green.png"},
            {name: "block_purple", url: "assets/block_purple.png"},
            {name: "block_red", url: "assets/block_red.png"},
            {name: "block_yellow", url: "assets/block_yellow.png"},
            {name: "bonus_bomb", url: "assets/bonus_bomb.png"},
            {name: "bonus_change", url: "assets/bonus_change.png"},
            {name: "bonus_full", url: "assets/bonus_full.png"},
            {name: "game_field", url: "assets/game_field.png"},
            {name: "money", url: "assets/money.png"},
            {name: "pause", url: "assets/pause.png"},
            {name: "progress_back", url: "assets/progress_back.png"},
            {name: "progress_front", url: "assets/progress_front.png"},
            {name: "score", url: "assets/score.png"}
        ])
        .load(() => resolve())
    });
        
    getTexture = (nameTexture) => this.loader.resources[nameTexture].texture;
}