import { Application, Graphics } from "pixi.js";
import { StoreTextures } from './loader.js'
import { Scene } from "./client/draw/scene.js";
import settings from "./settings/settingsScenes.json"
import {
  COUNT_ROWS, 
  COUNT_COLUMNS, 
  COLOR_ASSET,
  MAX_COUNT_SHAKE,
  MIN_GROUP,
  GOAL_COUNT_SCORE,
  LEN_GROUP_BOMB,
  PRICE_BOMB
} from "./settings/constants.js";
import { State } from "./state.js";
import { GameSession } from "./logical/gameSession.js"


const app = new Application({
  resizeTo: window,
  backgroundColor: 0xa1a1a1,
  view: document.querySelector('#scene')
});

let storeTextures = new StoreTextures();
const state = new State();
let gameSession;

const createSceneGame = (storeTextures) => {
  let sceneGame = new Scene();
  gameSession = new GameSession();
  sceneGame.createEntities(storeTextures, settings["game"], null);

  gameSession.getTiles().forEach(t => {
    createEntityForGameField(
      sceneGame,
      storeTextures,
      t.getId(),
      t.getColor(),
      t.getNumRow(),
      t.getNumColumn()
    )
  });

  drawProgress(sceneGame);

  resizeScene(sceneGame);

  return sceneGame;
}

const createSceneGameOver = (storeTextures) => {
  let sceneGameOver = new Scene();
  sceneGameOver.createEntities(storeTextures, settings["gameOver"], null);

  let scoreTotalText = sceneGameOver.getTextes().filter(t => t.getKeyName() === "scoreTotal")[0]; 
  let scoreGoalText = sceneGameOver.getTextes().filter(t => t.getKeyName() === "scoreGoal")[0];

  scoreTotalText.updateValue(`Your score: ${gameSession.getScorer().getCurrentScore()}`);
  scoreGoalText.updateValue(`Goal score: ${GOAL_COUNT_SCORE}`);

  resizeScene(sceneGameOver);
  
  return sceneGameOver;
}

const createSceneWinning = (storeTextures) => {
  let sceneWinning = new Scene();

  sceneWinning.createEntities(storeTextures, settings["winning"], null);

  let scoreTotalText = sceneWinning.getTextes().filter(t => t.getKeyName() === "scoreTotal")[0]; 
  scoreTotalText.updateValue(`Your score: ${gameSession.getScorer().getCurrentScore()}`);

  resizeScene(sceneWinning);

  return sceneWinning;
}

const updateSceneGame = (sceneGame) => {
  updateProgress(sceneGame);
  updateScreenInfo(sceneGame);

  if(!gameSession.isImpossibleMove()) {
    gameSession.mixedTiles();
    tailsForAnimation(sceneGame, gameSession.getTiles());

    if(gameSession.checkCountMixing()) {
      state.gameOver();
    }
  } else {
    gameSession.resetCountMixing();
    
    let tile = checkClickedTile(gameSession.getTiles(), sceneGame.getSprites());

    if(tile) {

      let group;
      if(tile.getColor() === "bomb") {

        group = gameSession.activateBomb(tile);
        destroyTiles(sceneGame, group); 
        gameSession.updateScorer(group.length);
        generateNewTiles(sceneGame, storeTextures);

      } else {
        group = gameSession.findingGroup(tile);

        if(group.length >= MIN_GROUP) {
          destroyTiles(sceneGame, group);  
          gameSession.updateScorer(group.length);
          
          if(group.length >= LEN_GROUP_BOMB) {
            generateBomb(sceneGame, tile);
          }

          generateNewTiles(sceneGame, storeTextures);
        }
      }

      if(gameSession.getScorer().checkGoal()) {
        gameSession.getScorer().resetMoves();
        state.winning();
      }

      if(gameSession.getScorer().checkLose()) {
        state.gameOver();
      }
    }
  }

  // click pause ?

  let bonusBomb = sceneGame.getSprites().filter(s => s.getKeyName() === "bonusBomb")[0];
  let iconBomb = sceneGame.getSprites().filter(s => s.getKeyName() === "bomb")[0];

  if(bonusBomb.checkClicked() || iconBomb.checkClicked()) {
    let tilesForReplace = gameSession.getTiles().filter(t => t.getColor() !== "bomb");

    if(tilesForReplace.length) {
      if(gameSession.getPlayer().pay(PRICE_BOMB)) {
        let randomTile = tilesForReplace[Math.floor(Math.random() * tilesForReplace.length)];
        randomTile.setBonus("bomb");
        sceneGame.destroySptite(randomTile.getId());
        createEntityForGameField(
          sceneGame, 
          storeTextures, 
          randomTile.getId(),
          randomTile.getColor(),
          randomTile.getNumRow(),
          randomTile.getNumColumn() 
        );
      }
    }
  }
}


storeTextures.build().then(() => {  
  let mainStage = createSceneGame(storeTextures);
  
  app.stage.addChild(mainStage.getScene());

  window.onresize = () => {
    resizeScene(mainStage);
  };

  app.ticker.add((deltaTime) => {

    if(!state.checkStateDrawingAnimation()) {

      if(state.checkChangeScene()) {
        if(state.checkGameOver()) {
          app.stage.removeChild(mainStage.getScene());
          mainStage.getScene().destroy({children:true});
  
          mainStage = createSceneGameOver(storeTextures);
          app.stage.addChild(mainStage.getScene());
  
        } else if(state.checkWinning()) {
          app.stage.removeChild(mainStage.getScene());
          mainStage.getScene().destroy({children:true});
          mainStage = createSceneWinning(storeTextures);
          
          app.stage.addChild(mainStage.getScene());
  
        } else if (state.checkGame()) {
          app.stage.removeChild(mainStage.getScene());
          mainStage.getScene().destroy({children:true});
          mainStage = createSceneGame(storeTextures);
          
          app.stage.addChild(mainStage.getScene());
        }
  
        state.uncheck();
      }


      if(state.checkWinning()) {
        let replay = mainStage.getSprites().filter(s => s.getKeyName() === "replay")[0];
        console.log(state);
        if(replay.checkClicked()) {
          state.resetGame();
        }
      } else if(state.checkGameOver()) {
        let replay = mainStage.getSprites().filter(s => s.getKeyName() === "replay")[0];
        if(replay.checkClicked()) {
          state.resetGame();
        }
      } else if(state.checkGame()) {
        updateSceneGame(mainStage);
      }
    }
    
    if (mainStage.checkAnimation()) {

      state.drawAnimation();
      
      mainStage.animate(deltaTime);

    } else {
      state.stopDrawAnimation();
    }

    mainStage.unclickingAll();
  });
});


const checkClickedTile = (tiles, entities) => {
  let clickedTile = null;

  entities.forEach(entity => {
    if(entity.checkClicked()) {
      clickedTile = tiles.filter(t => t.getId() === entity.getId())[0];
    }
  });

  return clickedTile;
}

const tailsForAnimation = (sceneGame, tiles) => {
  sceneGame.getSprites().forEach(e => {
    let tile = tiles.filter(t => t.getId() === e.getId())[0];
    
    if(tile) {
      sceneGame.addAnimation(
        e, 
        50, 
        tile.getNumColumn() / COUNT_COLUMNS, 
        tile.getNumRow() / COUNT_ROWS);
    }
  });
}

const createEntityForGameField = (sceneGame, storeTextures, idEntity, color, numRow, numCol) => {
  sceneGame.createSpriteEntity(
    storeTextures,
    idEntity,
    COLOR_ASSET[color],
    {
      "valueFill": 1 / Math.max(COUNT_ROWS, COUNT_COLUMNS),
      "indentTop": numRow / COUNT_ROWS,
      "indentLeft": numCol / COUNT_COLUMNS
    },
    sceneGame.getSprites().filter(e => e.getKeyName() === 'gameField')[0].getEntity()
  )
}

const updateScreenInfo = (sceneGame) => {
  sceneGame.getTextes().filter(
    t => t.getKeyName() === "countMoney"
  )[0].updateValue(
    gameSession.getPlayer().getCountMoney()
  );

  sceneGame.getTextes().filter(
    t => t.getKeyName() === "countMove"
  )[0].updateValue(
    gameSession.getScorer().getRestMove()
  );

  sceneGame.getTextes().filter(
    t => t.getKeyName() === "countScore"
  )[0].updateValue(
    gameSession.getScorer().getCurrentScore()
  );
}


const destroyTiles = (sceneGame, group) => {
  group.forEach(
    g => {
      sceneGame.destroySptite(g.getId());
      let removingTile = gameSession.getTiles().filter(t => t.getId() === g.getId())[0];
      gameSession.getTiles().splice(gameSession.getTiles().indexOf(removingTile), 1);
    } 
  );
}


const generateBomb = (sceneGame, tile) => {
  let bombTile = gameSession.generateTile(tile.getNumRow(), tile.getNumColumn());
  bombTile.setBonus("bomb");

  createEntityForGameField(
    sceneGame,
    storeTextures,
    bombTile.getId(),
    bombTile.getColor(),
    bombTile.getNumRow(),
    bombTile.getNumColumn()
  );
}


const generateNewTiles = (sceneGame, storeTextures) => {
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
          //tailsForAnimation(gameSession.getTiles(), sceneGame.getSprites());
          sceneGame.addAnimation(
            sceneGame.getSprites().filter(s => s.getId() === tileForMove.getId())[0],
            50,
            j / COUNT_COLUMNS,
            maxFreeRow / COUNT_ROWS
          );

        } else {

          let newTile = gameSession.generateTile(maxFreeRow, j);

          createEntityForGameField(
            sceneGame,
            storeTextures,
            newTile.getId(),
            newTile.getColor(),
            0,
            j
          );

          //tailsForAnimation(gameSession.getTiles(), sceneGame.getSprites());
          sceneGame.addAnimation(
            sceneGame.getSprites().filter(s => s.getId() === newTile.getId())[0],
            50,
            j / COUNT_COLUMNS,
            maxFreeRow / COUNT_ROWS
          );
        }
      }
    }
  }
}

const resizeScene = (scene) => {
  scene.getSprites().forEach(e => {
    e.resize();
    e.setPosition();
  });

  scene.getTextes().forEach(t => {
    t.setPosition();
  });
}

const drawProgress = (sceneGame) => {
  let spriteProgress = sceneGame.getSprites().filter(s => s.getKeyName() === "progressFront")[0];

  let maskProgress = new Graphics();
  sceneGame.getScene().addChild(maskProgress);

  spriteProgress.mask = maskProgress;

}

const updateProgress = (sceneGame) => {
  let spriteProgress = sceneGame.getSprites().filter(s => s.getKeyName() === "progressFront")[0];
  let valueProgress = gameSession.getScorer().getProgress();

  spriteProgress.mask.clear();
  spriteProgress.mask.beginFill(0x011938);
  spriteProgress.mask.drawRoundedRect(
    spriteProgress.getX() + valueProgress * spriteProgress.getWidth(), 
    spriteProgress.getY(), 
    (1 - valueProgress) * spriteProgress.getWidth(), 
    spriteProgress.getHeight(),
    10);
  spriteProgress.mask.endFill();
}