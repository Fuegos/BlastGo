import { Application, Graphics } from "pixi.js";
import { StoreTextures } from './loader.js'
import { Scene } from "./client/draw/scene.js";
import settings from "./settings/settingsScenes.json"
import {
  COUNT_ROWS, 
  COUNT_COLUMNS, 
  MIN_GROUP,
  GOAL_COUNT_SCORE,
  LEN_GROUP_BOMB,
  PRICE_BOMB
} from "./settings/constants.js";
import { State } from "./state.js";
import { GameSession } from "./logical/gameSession.js"
import { MovementAnimation } from "./client/animation/movementAnimation.js";
import { TextAnimation } from "./client/animation/textAnimation.js";
import { AlphaAnimation } from "./client/animation/alphaAnimation.js";
import { ProgressAnimation } from "./client/animation/progressAnimation.js";
import { DrawerGameField } from "./client/draw/drawerGameField.js";


const app = new Application({
  resizeTo: window,
  backgroundColor: 0xa1a1a1,
  view: document.querySelector('#scene')
});

let storeTextures = new StoreTextures();
const state = new State();
let drawerGameField = new DrawerGameField();
let gameSession;


const createSceneGame = (storeTextures) => {
  let sceneGame = new Scene();
  gameSession = new GameSession();
  sceneGame.createEntities(storeTextures, settings["game"], null);

  updateText(sceneGame, "countScore", 50, 0, gameSession.getScorer().getCurrentScore());
  updateText(sceneGame, "countMove", 50, 0, gameSession.getScorer().getRestMove());
  updateText(sceneGame, "countMoney", 50, 0, gameSession.getPlayer().getCountMoney());

  gameSession.getTiles().forEach(t => {
    drawerGameField.generateEntityForTile(
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

  updateText(sceneGameOver, "scoreTotal", 50, 0, gameSession.getScorer().getCurrentScore());
  updateText(sceneGameOver, "scoreGoal", 50, 0, GOAL_COUNT_SCORE);

  resizeScene(sceneGameOver); 
  
  return sceneGameOver;
}

const createSceneWinning = (storeTextures) => {
  let sceneWinning = new Scene();
  sceneWinning.createEntities(storeTextures, settings["winning"], null);

  updateText(sceneWinning, "scoreTotal", 50, 0, gameSession.getScorer().getCurrentScore());

  resizeScene(sceneWinning);

  return sceneWinning;
}

const updateText = (scene, keyName, time, curValue, goalValue) => {
  let textEntity = scene.getEntityByKeyName(keyName);

  scene.getQueueAnimations().pushAsync(
    new TextAnimation(
      textEntity,
      time,
      false,
      curValue,
      goalValue
    )
  )
}

const updateSceneGame = (sceneGame) => {
  sceneGame.destroy();

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
      let curCountScore = gameSession.getScorer().getCurrentScore();
      let curCountMove = gameSession.getScorer().getRestMove();
      let curProgress = gameSession.getScorer().getProgress();

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

      updateText(sceneGame, "countScore", 50, curCountScore, gameSession.getScorer().getCurrentScore());
      updateText(sceneGame, "countMove", 50, curCountMove, gameSession.getScorer().getRestMove());
      updateProgress(sceneGame, curProgress, gameSession.getScorer().getProgress());
      resizeScene(sceneGame);
    }
  }

  let bonusBomb = sceneGame.getEntityByKeyName("bonusBomb");
  let iconBomb = sceneGame.getEntityByKeyName("bomb");

  if(bonusBomb.checkClicked() || iconBomb.checkClicked()) {
    let tilesForReplace = gameSession.getTiles().filter(t => t.getColor() !== "bomb");

    if(tilesForReplace.length) {
      let curCountMoney = gameSession.getPlayer().getCountMoney();

      if(gameSession.getPlayer().pay(PRICE_BOMB)) {
        let randomTile = tilesForReplace[Math.floor(Math.random() * tilesForReplace.length)];
        randomTile.setBonus("bomb");
        sceneGame.destroySptite(randomTile.getId());
        drawerGameField.generateEntityForTile(
          sceneGame, 
          storeTextures, 
          randomTile.getId(),
          randomTile.getColor(),
          randomTile.getNumRow(),
          randomTile.getNumColumn()
        )
        
        resizeScene(sceneGame);
      }

      updateText(sceneGame, "countMoney", 50, curCountMoney, gameSession.getPlayer().getCountMoney());
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
    if(!state.checkInterceptAnimation()) {

      if(state.checkChangeScene()) {
        if(state.checkGameOver()) {
          mainStage.getDestroyer().push(mainStage.getScene());
          mainStage.destroy();
  
          mainStage = createSceneGameOver(storeTextures);
          app.stage.addChild(mainStage.getScene());
  
        } else if(state.checkWinning()) {
          mainStage.getDestroyer().push(mainStage.getScene());
          mainStage.destroy();
          mainStage = createSceneWinning(storeTextures);
          
          app.stage.addChild(mainStage.getScene());
  
        } else if (state.checkGame()) {
          mainStage.getDestroyer().push(mainStage.getScene());
          mainStage.destroy();
          mainStage = createSceneGame(storeTextures);
          
          app.stage.addChild(mainStage.getScene());
        }
  
        state.uncheck();
      }


      if(state.checkWinning()) {
        let replay = mainStage.getEntityByKeyName("replay");
        if(replay.checkClicked()) {
          state.resetGame();
        }
      } else if(state.checkGameOver()) {
        let replay = mainStage.getEntityByKeyName("replay");
        if(replay.checkClicked()) {
          state.resetGame();
        }
      } else if(state.checkGame()) {
        updateSceneGame(mainStage);
      }
    }

    if (mainStage.getQueueAnimations().checkIntercept()) {
      state.interceptAnimation();
    } else {
      state.stopInterceptAnimation();
    }

    mainStage.getQueueAnimations().animate(deltaTime);

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
  let animations = [];

  sceneGame.getSprites().forEach(e => {
    let tile = tiles.filter(t => t.getId() === e.getId())[0];
    
    if(tile) {
      animations.push(
        new MovementAnimation(
          e,
          50,
          true,
          e.getPositioner().getIndentLeft(), 
          e.getPositioner().getIndentTop(),
          drawerGameField.calcIndentLeft(tile.getNumColumn()),
          drawerGameField.calcIndentTop(tile.getNumRow())
        )
      );
    }
  });

  sceneGame.getQueueAnimations().pushNewGroup(animations);
}

const destroyTiles = (sceneGame, group) => {
  let animations = [];

  group.forEach(
    g => {
      sceneGame.destroySptite(g.getId());
      let spriteEntity = sceneGame.getEntityById(g.getId());
      animations.push(
        new AlphaAnimation(
          spriteEntity,
          50,
          true,
          false
        )
      )

      let removingTile = gameSession.getTiles().filter(t => t.getId() === g.getId())[0];
      gameSession.getTiles().splice(gameSession.getTiles().indexOf(removingTile), 1);
    } 
  );

  sceneGame.getQueueAnimations().pushNewGroup(animations);
}


const generateBomb = (sceneGame, tile) => {
  let bombTile = gameSession.generateTile(tile.getNumRow(), tile.getNumColumn());
  bombTile.setBonus("bomb");

  drawerGameField.generateEntityForTile(
    sceneGame,
    storeTextures,
    bombTile.getId(),
    bombTile.getColor(),
    bombTile.getNumRow(),
    bombTile.getNumColumn()
  )
}


const generateNewTiles = (sceneGame, storeTextures) => {
  let emergenceAnimatioms = [];
  let movementAnimations = [];

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

          let spriteTile = sceneGame.getEntityById(tileForMove.getId());

          movementAnimations.push(
            new MovementAnimation(
              spriteTile,
              50,
              true,
              spriteTile.getPositioner().getIndentLeft(),
              spriteTile.getPositioner().getIndentTop(),
              drawerGameField.calcIndentLeft(j),
              drawerGameField.calcIndentTop(maxFreeRow)
            )
          );

        } else {

          let newTile = gameSession.generateTile(maxFreeRow, j);

          let spriteEntity = drawerGameField.generateEntityForTile(
            sceneGame,
            storeTextures,
            newTile.getId(),
            newTile.getColor(),
            0,
            j
          );

          emergenceAnimatioms.push(
            new AlphaAnimation(
              spriteEntity,
              50,
              true,
              true
            )
          );

          let spriteTile = sceneGame.getEntityById(newTile.getId());

          movementAnimations.push(
            new MovementAnimation(
              spriteTile,
              50,
              true,
              spriteTile.getPositioner().getIndentLeft(),
              spriteTile.getPositioner().getIndentTop(),
              drawerGameField.calcIndentLeft(j),
              drawerGameField.calcIndentTop(maxFreeRow)
            )
          )
        }
      }
    }
  }

  sceneGame.getQueueAnimations().pushNewGroup(movementAnimations);
  sceneGame.getQueueAnimations().pushNewGroup(emergenceAnimatioms);
}

const resizeScene = (scene) => {
  scene.getEntities().forEach(e => {
    e.getResizer().resize(e.getEntity());
    e.getPositioner().setPosition(e.getEntity());
  });
}

const drawProgress = (sceneGame) => {
  let spriteProgress = sceneGame.getEntityByKeyName("progressFront");
  let maskProgress = new Graphics();
  sceneGame.getScene().addChild(maskProgress);

  spriteProgress.getEntity().mask = maskProgress;
}

const updateProgress = (sceneGame, curProgress, goalProgress) => {
  let spriteProgress = sceneGame.getEntityByKeyName("progressFront");
  sceneGame.getQueueAnimations().pushAsync(
    new ProgressAnimation(
      spriteProgress,
      50,
      false,
      curProgress,
      goalProgress
    )
  )
}