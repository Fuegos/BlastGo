import {
    COUNT_ROWS, 
    COUNT_COLUMNS, 
    COUNT_COLORS, 
    COLORS, 
    COLOR_ASSET,
    GOAL_COUNT_MOVE,
    GOAL_COUNT_SCORE,
    INIT_COUNT_MONEY,
    MAX_COUNT_SHAKE,
    MIN_GROUP
  } from "./constants.js";
import { Player } from "./Player.js";
import { Tile } from "./Tile.js";

const generateRandomColors = (count) => COLORS.sort(() => 0.5 - Math.random()).slice(0, count);

const getRandomColor = (arr) => arr[Math.floor(Math.random() * arr.length)];

let arrColors = generateRandomColors(COUNT_COLORS);

export class GameSession {
    constructor() {
        this.player = new Player();
        this.tiles = [];
        for(let i = 0; i < COUNT_ROWS; i++) {
            for(let j = 0; j < COUNT_COLUMNS; j++) {
                this.generateTile(i, j);
            }
        }
    }

    generateTile(numRow, numCol) {
        let color = getRandomColor(arrColors);

        let tile = new Tile(color, numRow, numCol);

        this.tiles.push(tile);

        return tile;
    }

    getTiles = () => this.tiles;

    
}