import { v4 as uuidv4 } from 'uuid';

export class Tile {

    constructor(color, numRow, numColumn) {
        this._id = uuidv4();
        this.color = color;
        this.numRow = numRow;
        this.numColumn = numColumn;
    }

    getId = () => this._id;

    changeRow = (numRow) => this.numRow = numRow;

    changeColumn = (numColumn) => this.numColumn = numColumn;
    
    getNumRow = () => this.numRow;

    getNumColumn = () => this.numColumn;

    getColor = () => this.color;

    setBonus = (bonus) => this.color = bonus;
    
}