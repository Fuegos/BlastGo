import { Loader } from "pixi.js";
import { WebfontLoaderPlugin } from "pixi-webfont-loader";

Loader.registerPlugin(WebfontLoaderPlugin);


export class StoreTextures {
    constructor() {
        this.loader = new Loader();
    }

    build = () => new Promise((resolve, reject) => {
        let folderImg = "assets/images/";
        let folderFont = "assets/fonts/";

        this.loader
        .add([
            {name: "blockBlue", url: folderImg + "block_blue.png"},
            {name: "blockGreen", url: folderImg + "block_green.png"},
            {name: "blockPurple", url: folderImg + "block_purple.png"},
            {name: "blockRed", url: folderImg + "block_red.png"},
            {name: "blockYellow", url: folderImg + "block_yellow.png"},
            {name: "bonusBomb", url: folderImg + "bonus_bomb.png"},
            {name: "bonusChange", url: folderImg + "bonus_change.png"},
            {name: "bonusFull", url: folderImg + "bonus_full.png"},
            {name: "gameField", url: folderImg + "game_field.png"},
            {name: "money", url: folderImg + "money.png"},
            {name: "pause", url: folderImg + "pause.png"},
            {name: "progressBack", url: folderImg + "progress_back.png"},
            {name: "progressFront", url: folderImg + "progress_front.png"},
            {name: "score", url: folderImg + "score.png"},
            {name: "bomb", url: folderImg + "bomb.png"},
            {name: "marvinFont", url: folderFont + "Marvin.ttf"}
        ])
        .load(() => resolve())
    });
        
    getTexture = (name) => this.loader.resources[name].texture;
}