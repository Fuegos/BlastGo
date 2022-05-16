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
    MIN_GROUP,
    RADIUS_BOMB
  } from "./constants.js";
import { Player } from "./Player.js";
import { Tile } from "./Tile.js";
import { Scorer } from "./scorer";

const generateRandomColors = (count) => COLORS.sort(() => 0.5 - Math.random()).slice(0, count);

const getRandomColor = (arr) => arr[Math.floor(Math.random() * arr.length)];

let arrColors = generateRandomColors(COUNT_COLORS);

export class GameSession {
    constructor() {
        this.player = new Player();
        this.scorer = new Scorer();
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

    activateBomb = (bomb) => {
        let group = [bomb];
        let bombs = [bomb];


        while(bombs.length) {
            let curBomb = bombs.shift(); 
            let foundTiles = this.tiles
                // todo acses in private field
                .filter(t => group.every(g => g._id !== t.getId()))
                .filter(
                    t => Math.abs(t.getNumRow() - curBomb.getNumRow()) <= RADIUS_BOMB
                        && Math.abs(t.getNumColumn() - curBomb.getNumColumn()) <= RADIUS_BOMB
                )
            
            group.push(...foundTiles);

            let foundBombs = foundTiles.filter(t => t.getColor() === "bomb");
            bombs.push(...foundBombs);
        }

        return group;
    }

    findingGroup = (tile) => {
        let curLen = 0;
        let group = [tile];
      
        while(curLen != group.length) {
          curLen = group.length;
      
          let foundTiles = this.tiles
            .filter(t => t.getColor() === tile.getColor() )
            // todo acses in private field
            .filter(t => group.every(g => g._id !== t.getId()))
            .filter(
              t => group.some(
                g => Math.abs(g.numRow - t.getNumRow()) === 1 && g.numColumn === t.getNumColumn()
                  || g.numRow === t.getNumRow() && Math.abs(g.numColumn - t.getNumColumn()) === 1  
              )
            )
      
          group.push(...foundTiles);
        }
        
        return group;
    }

    isImpossibleMove = () => {
        let result = false;
        this.tiles.forEach(t => {
            //console.log(this.findingGroup(t).length);
            if(this.findingGroup(t).length >= MIN_GROUP || t.getColor() === "bomb") {
                result = true;
            }
        });

        return result;
    }

    mixedTiles = () => {
        let randomRowCol = [];
        
        [...Array(COUNT_ROWS).keys()].forEach(r => {
            [...Array(COUNT_COLUMNS).keys()].forEach(c => {
                randomRowCol.push({row: r, col: c});
            });
        });
        
        this.tiles.forEach(t => {
            let rowCol = randomRowCol.splice(Math.floor(Math.random() * randomRowCol.length), 1)[0];
            //console.log(rowCol);
            t.changeRow(rowCol.row);
            t.changeColumn(rowCol.col);
        });
    }

    updateScorer = (lenGroup) => {
        this.scorer.accrueScore(lenGroup);
        this.scorer.takeAwayMove();
    }

    getScorer = () => this.scorer;

    getPlayer = () => this.player;
}