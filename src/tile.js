export class Tile {

    constructor(color, numRow, numColumn) {
        this.color = color;
        this.numRow = numRow;
        this.numColumn = numColumn;
    }

    changeRow = (numRow) => this.numRow = numRow;

    changeColumn = (numColumn) => this.numColumn = numColumn;
    
    getNumRow = () => this.numRow;

    getNumColumn = () => this.numColumn;
}