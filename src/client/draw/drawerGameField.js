import { 
    COUNT_ROWS, 
    COUNT_COLUMNS, 
    COLOR_ASSET,
    PADDING_GAME_FIELD_X,
    PADDING_GAME_FIELD_Y
 } from "../../settings/constants";


export class DrawerGameField {
    constructor() {}

    getPadding = () => {
        if(COUNT_COLUMNS > COUNT_ROWS) {
            return PADDING_GAME_FIELD_X;
        } else {
            return PADDING_GAME_FIELD_Y;
        }
    }

    calcValueFill = () => {
        return (1 - this.getPadding() * 2) / Math.max(COUNT_ROWS, COUNT_COLUMNS);
    }

    calcIndentLeft = (numCol) => {
        let freeSpace = (1 - PADDING_GAME_FIELD_X * 2) - COUNT_COLUMNS * this.calcValueFill();
        return PADDING_GAME_FIELD_X + freeSpace / 2 + numCol * this.calcValueFill();
    }

    calcIndentTop = (numRow) => {
        let freeSpace = (1 - PADDING_GAME_FIELD_Y * 2) - COUNT_ROWS * this.calcValueFill();
        return PADDING_GAME_FIELD_Y + freeSpace / 2 + numRow * this.calcValueFill();
    }

    generateEntityForTile = (sceneGame, storeTextures, idEntity, color, numRow, numCol) => {
        let drawSettings = {
            "valueFill": this.calcValueFill(),
            "indentLeft": this.calcIndentLeft(numCol),
            "indentTop": this.calcIndentTop(numRow)
        }
        
        let spriteEntity = sceneGame.createSpriteEntity(
            storeTextures,
            idEntity,
            COLOR_ASSET[color],
            {
                "laptop": drawSettings,
                "mobile": drawSettings
            },
            sceneGame.getEntityByKeyName("gameField").getEntity()
        )

        return spriteEntity;
    }
}