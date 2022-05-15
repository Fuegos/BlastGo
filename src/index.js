import { Application } from "pixi.js";
import { StoreTextures } from './loader.js'
import { Scene } from "./scene.js";
import settings from "./settings"
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
import { State } from "./state.js";
import { MovementAnimation } from "./movementAnimation.js";
import { GameSession } from "./gameSession.js"


const app = new Application({
  resizeTo: window,
  backgroundColor: 0xa1a1a1,
  view: document.querySelector('#scene')
});

let storeTextures= new StoreTextures();
const state = new State();
let gameSession = new GameSession();

storeTextures.build().then(() => {  
  let sceneGame = new Scene();
  sceneGame.createEntities(storeTextures, settings["game"], null);
  app.stage.addChild(sceneGame.getScene());

  let movementAnimations = [];

  let player = new Player();

  gameSession.getTiles().forEach(t => {
    sceneGame.createSpriteEntity(
      storeTextures,
      t.getId(),
      COLOR_ASSET[t.getColor()],
      {
        "valueFill": 1 / Math.max(COUNT_ROWS, COUNT_COLUMNS),
        "indentTop": t.getNumRow() / COUNT_ROWS,
        "indentLeft": t.getNumColumn() / COUNT_COLUMNS
      },
      sceneGame.getSprites().filter(e => e.getKeyName() === 'gameField')[0].getEntity()
    )
  });

  
  sceneGame.getSprites().forEach(e => {
    e.resize();
    e.setPosition();
  });

  sceneGame.getTextes().forEach(t => {
    t.setPosition();
  });

  window.onresize = () => {
    sceneGame.getSprites().forEach(e => {
      e.resize();
      e.setPosition();
    });

    sceneGame.getTextes().forEach(t => {
      t.setPosition();
    });
  };

  app.ticker.add((deltaTime) => {
    if(!state.checkStateDrawingAnimation()) {
      // check impossible move
      // mixed

      let tile = checkClickedTile(gameSession.getTiles(), sceneGame.getSprites());

      if(tile) {
        // is tile bonus?
        //// create group (check what destroy other bonus with activate)
        let group = findingGroup(tile, gameSession.getTiles());

        if(group.length >= MIN_GROUP) {
          group.forEach(
            g => {
              sceneGame.destroySptite(g.getId());
              let removingTile = gameSession.getTiles().filter(t => t.getId() === g.getId())[0];
              gameSession.getTiles().splice(gameSession.getTiles().indexOf(removingTile), 1);
            } 
          );

          // accrue score
          player.getScorer().accrueScore(group.length);
          // minus move
          player.getScorer().takeAwayMove();
          // generate bonuse ?
          // generate new sprite
          while(gameSession.getTiles().length != COUNT_ROWS * COUNT_COLUMNS) {

            for(let j = 0; j < COUNT_COLUMNS; j++) {

              let tilesSameCol = gameSession.getTiles().filter(t => t.getNumColumn() === j);

              if(tilesSameCol.length != COUNT_ROWS) {
                
                let maxFreeRow = COUNT_ROWS - 1;
                let nearRow = null;

                if(tilesSameCol.length != 0) {

                  maxFreeRow = Math.max(
                    ...[
                      ...Array(COUNT_ROWS).keys()
                    ].filter(
                      row => tilesSameCol.every(t => t.getNumRow() !== row)
                    )
                  );
                  
                  let nearTiles = tilesSameCol.filter(t => t.getNumRow() < maxFreeRow);

                  if(nearTiles.length) {
                    nearRow = Math.max(
                      ...nearTiles.map(t => t.getNumRow())
                    )
                  }
                }

                if(nearRow !== null) {
                  let tileForMove = tilesSameCol.filter(t => t.getNumRow() === nearRow)[0];

                  tileForMove.changeRow(maxFreeRow);

                  movementAnimations.push(
                    new MovementAnimation(
                      sceneGame.getSprites().filter(s => s.getId() === tileForMove.getId())[0],
                      5000,
                      j / COUNT_COLUMNS,
                      maxFreeRow / COUNT_ROWS
                    )
                  );

                } else {

                  let newTile = gameSession.generateTile(maxFreeRow, j);

                  sceneGame.createSpriteEntity(
                    storeTextures,
                    newTile.getId(),
                    COLOR_ASSET[newTile.getColor()],
                    {
                      "valueFill": 1 / Math.max(COUNT_ROWS, COUNT_COLUMNS),
                      "indentTop": 0,
                      "indentLeft": j / COUNT_COLUMNS
                    },
                    sceneGame.getSprites().filter(e => e.getKeyName() === 'gameField')[0].getEntity()
                  )

                  movementAnimations.push(
                    new MovementAnimation(
                      sceneGame.getSprites().filter(s => s.getId() === newTile.getId())[0],
                      5000,
                      j / COUNT_COLUMNS,
                      maxFreeRow / COUNT_ROWS
                    )
                  );
                }
              }
            }
          }
          // is winning
          //// score for rest move
          //// set end

          // update screen score
        }
      }
      
      // click pause ?
      // click shop bonsuse ?
      //// replace tile to bonuce random
    }
    
    if (movementAnimations.length) {

      state.drawAnimation();
      movementAnimations.forEach(a => a.move(deltaTime));
    
      let animateCompleted = movementAnimations.filter(a => a.getIsCompleted());
      animateCompleted.forEach(a => {
        movementAnimations.splice(movementAnimations.indexOf(a), 1);
      });

    } else {
      state.stopDrawAnimation();
    }

    sceneGame.unclickingAll();
  });
});

const findingGroup = (tile, tiles) => {
  let curLen = 0;
  let group = [tile];

  while(curLen != group.length) {
    curLen = group.length;

    let foundTiles = tiles
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


const checkClickedTile = (tiles, entities) => {
  let clickedTile = null;

  entities.forEach(entity => {
    if(entity.checkClicked()) {
      //entity.unclicking();
      clickedTile = tiles.filter(t => t.getId() === entity.getId())[0];
    }
  });

  return clickedTile;
}
