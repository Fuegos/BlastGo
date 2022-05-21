import { 
    COLORS, 
    MAX_COUNT_SHAKE,
    MIN_GROUP,
    RADIUS_BOMB,
    MAX_COUNT_COLORS,
    MIN_COUNT_COLORS,
    MAX_COUNT_ROWS,
    MIN_COUNT_ROWS,
    MAX_COUNT_COLUMNS,
    MIN_COUNT_COLUMNS
  } from "../settings/constants.js";
import { Player } from "./player.js";
import { Tile } from "./tile.js";
import { Scorer } from "./scorer";

export class GameSession {
    constructor() {
        this.player = new Player();
        this.scorer = new Scorer();
        this.tiles = [];
        this.curCountMixing = 0;
        this.arrColors = this.generateRandomColors(this.countColors);
        this.countColumns = Math.floor(
            Math.random() * (MAX_COUNT_COLUMNS - MIN_COUNT_COLUMNS + 1)
        ) + MIN_COUNT_COLUMNS;
        this.countRows = Math.floor(
            Math.random() * (MAX_COUNT_ROWS - MIN_COUNT_ROWS + 1)
        ) + MIN_COUNT_ROWS;

        this.generateTiles();
    }

    getCountColumns = () => this.countColumns;

    getCountRows = () => this.countRows;

    generateRandomColors = () => {
        const countColors = Math.floor(
            Math.random() * (MAX_COUNT_COLORS - MIN_COUNT_COLORS + 1)
        ) + MIN_COUNT_COLORS;
        
        return COLORS.sort(() => 0.5 - Math.random()).slice(0, countColors);
    } 

    getRandomColor = () => this.arrColors[Math.floor(Math.random() * this.arrColors.length)];

    generateTiles() {
        let newTiles = [];

        for(let i = 0; i < this.countRows; i++) {
            for(let j = 0; j < this.countColumns; j++) {
                if(this.tiles.filter(t => t.getNumRow() === i && t.getNumColumn() === j).length === 0) {
                    let color = this.getRandomColor();
                    let tile = new Tile(color, i, j);
                    this.tiles.push(tile);
                    newTiles.push(tile);
                }
            }
        }

        return newTiles;
    }

    moveDownTiles = () => {
        let movedTiles = [];

        for(let j = 0; j < this.countColumns; j++) {
            for(let i = this.countRows - 1; i >= 0 ; i--) {

                let tilesSameCol = this.getTiles().filter(t => t.getNumColumn() === j);

                if(!tilesSameCol.some(t => t.getNumRow() === i)) {
                    let nearTiles = tilesSameCol.filter(t => t.getNumRow() < i);

                    if(nearTiles.length !== 0) {
                        let nearRow = Math.max(
                            ...nearTiles.map(t => t.getNumRow())
                        );
                        
                        let tileForMove = tilesSameCol.filter(t => t.getNumRow() === nearRow)[0];
                        tileForMove.changeRow(i);
                        movedTiles.push(tileForMove);
                    }
                }       
            }
        }

        return movedTiles;
    }

    getTiles = () => this.tiles;

    activateBomb = (bomb) => {
        let group = [bomb];
        let bombs = [bomb];

        while(bombs.length) {
            let curBomb = bombs.shift(); 
            let foundTiles = this.tiles
                .filter(t => group.every(g => g.getId() !== t.getId()))
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
            .filter(t => group.every(g => g.getId() !== t.getId()))
            .filter(
              t => group.some(
                g => Math.abs(g.getNumRow() - t.getNumRow()) === 1 && g.getNumColumn() === t.getNumColumn()
                  || g.getNumRow() === t.getNumRow() && Math.abs(g.getNumColumn() - t.getNumColumn()) === 1  
              )
            )
      
          group.push(...foundTiles);
        }
        
        return group;
    }

    isImpossibleMove = () => {
        let result = false;
        this.tiles.forEach(t => {
            if(this.findingGroup(t).length >= MIN_GROUP || t.getColor() === "bomb") {
                result = true;
            }
        });

        return result;
    }

    mixedTiles = () => {
        this.curCountMixing++;
        let randomRowCol = [];
        
        [...Array(this.countRows).keys()].forEach(r => {
            [...Array(this.countColumns).keys()].forEach(c => {
                randomRowCol.push({row: r, col: c});
            });
        });
        
        this.tiles.forEach(t => {
            let rowCol = randomRowCol.splice(Math.floor(Math.random() * randomRowCol.length), 1)[0];
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

    checkCountMixing = () => this.curCountMixing === MAX_COUNT_SHAKE

    resetCountMixing = () => this.curCountMixing = 0;
}