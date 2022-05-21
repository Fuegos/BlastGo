import { Scene } from "./draw/scene.js";
import { GameSession } from "../logical/gameSession.js"
import { DrawerGameField } from "./draw/drawerGameField.js";
import { ManagerAnimations } from "./managerAnimations.js";
import { State } from "../state.js";
import settings from "../settings/settingsScenes.json"
import {
    MIN_GROUP,
    GOAL_COUNT_SCORE,
    LEN_GROUP_BOMB,
    PRICE_BOMB
} from "../settings/constants.js";


export class ManagerScenes {
    constructor(storeTextures) {
        this.storeTextures = storeTextures;
        this.managerAnimations = new ManagerAnimations();
        this.state = new State();
        this.mainStage = new Scene();
        this.gameSession = new GameSession();
        this.drawerGameField = new DrawerGameField();

        window.onresize = () => {
          this.mainStage.resize();
          if(this.state.checkGame()) {
            this.managerAnimations.updateProgress(
              this.mainStage, 
              this.gameSession.getScorer().getProgress(), 
              this.gameSession.getScorer().getProgress());
          }
        };
    }

    getMainStage = () => this.mainStage;

    getState = () => this.state;

    getManagerAnimations = () => this.managerAnimations;

    createSceneGame = () => {
        this.mainStage = new Scene();
        this.gameSession = new GameSession();
        this.drawerGameField = new DrawerGameField(
          this.gameSession.getCountRows(), 
          this.gameSession.getCountColumns()
        );

        this.mainStage.createEntities(this.storeTextures, settings["game"], null);
      
        this.managerAnimations.updateText(
          this.mainStage, 
          "countScore", 
          50, 
          0, 
          this.gameSession.getScorer().getCurrentScore()
        );
        this.managerAnimations.updateText(
          this.mainStage, 
          "countMove", 
          50, 
          0, 
          this.gameSession.getScorer().getRestMove()
        );
        this.managerAnimations.updateText(
          this.mainStage, 
          "countMoney", 
          50, 
          0, 
          this.gameSession.getPlayer().getCountMoney()
        );
      
        this.gameSession.getTiles().forEach(t => {
            this.drawerGameField.generateEntityForTile(
                this.mainStage,
                this.storeTextures,
                t.getId(),
                t.getColor(),
                t.getNumRow(),
                t.getNumColumn()
            )
        });
      
        this.drawerGameField.drawProgress(this.mainStage);
      
        this.mainStage.resize();
    }

    createSceneGameOver = () => {
        this.mainStage = new Scene();
        this.mainStage.createEntities(this.storeTextures, settings["gameOver"], null);
      
        this.managerAnimations.updateText(
          this.mainStage, 
          "scoreTotal", 
          50, 
          0, 
          this.gameSession.getScorer().getCurrentScore()
        );
        this.managerAnimations.updateText(
          this.mainStage, 
          "scoreGoal", 
          50, 
          0, 
          GOAL_COUNT_SCORE
        );
      
        this.mainStage.resize();         
    }

    createSceneWinning = () => {
        this.mainStage = new Scene();
        this.mainStage.createEntities(this.storeTextures, settings["winning"], null);
      
        this.managerAnimations.updateText(
          this.mainStage, 
          "scoreTotal", 
          50, 
          0, 
          this.gameSession.getScorer().getCurrentScore()
        );
      
        this.mainStage.resize();
    }


    updateSceneGame = () => {
      this.mainStage.getDestroyer().destroy();
    
      if(!this.gameSession.isImpossibleMove()) {
        this.gameSession.mixedTiles();

        this.managerAnimations.moveTiles(
          this.mainStage, 
          this.drawerGameField, 
          this.gameSession.getTiles()
        );
    
        if(this.gameSession.checkCountMixing()) {
          this.state.gameOver();
        }

      } else {
        this.gameSession.resetCountMixing();
        
        let tile = this.checkClickedTile(this.gameSession.getTiles(), this.mainStage.getSprites());
    
        if(tile) {
    
          let group;
          let curCountScore = this.gameSession.getScorer().getCurrentScore();
          let curCountMove = this.gameSession.getScorer().getRestMove();
          let curProgress = this.gameSession.getScorer().getProgress();
    
          if(tile.getColor() === "bomb") {
    
            group = this.gameSession.activateBomb(tile);
            this.destroyTiles(group); 
            this.gameSession.updateScorer(group.length);
            this.generateNewTiles();
    
          } else {
            group = this.gameSession.findingGroup(tile);
    
            if(group.length >= MIN_GROUP) {
              this.gameSession.updateScorer(group.length);
              
              if(group.length >= LEN_GROUP_BOMB) {
                group.splice(group.indexOf(tile), 1);
                this.generateBomb(tile);
              }
    
              this.destroyTiles(group);  
              this.generateNewTiles();
            }
          }
    
          if(this.gameSession.getScorer().checkGoal()) {
            this.gameSession.getScorer().resetMoves();
            this.state.winning();
          }
    
          if(this.gameSession.getScorer().checkLose()) {
            this.state.gameOver();
          }
    
          this.managerAnimations.updateText(
            this.mainStage, 
            "countScore", 
            50, 
            curCountScore, 
            this.gameSession.getScorer().getCurrentScore()
          );

          this.managerAnimations.updateText(
            this.mainStage, 
            "countMove", 
            50, 
            curCountMove, 
            this.gameSession.getScorer().getRestMove()
          );

          this.managerAnimations.updateProgress(
            this.mainStage, 
            curProgress, 
            this.gameSession.getScorer().getProgress()
          );

          this.mainStage.resize();
        }
      }
    
      let bonusBomb = this.mainStage.getEntityByKeyName("bonusBomb");
      let iconBomb = this.mainStage.getEntityByKeyName("bomb");
    
      if(bonusBomb.checkClicked() || iconBomb.checkClicked()) {
        let tilesForReplace = this.gameSession.getTiles().filter(t => t.getColor() !== "bomb");
    
        if(tilesForReplace.length) {
          let curCountMoney = this.gameSession.getPlayer().getCountMoney();
    
          if(this.gameSession.getPlayer().pay(PRICE_BOMB)) {
            let randomTile = tilesForReplace[Math.floor(Math.random() * tilesForReplace.length)];
            this.generateBomb(randomTile);
          }
    
          this.managerAnimations.updateText(
            this.mainStage, 
            "countMoney", 
            50, 
            curCountMoney, 
            this.gameSession.getPlayer().getCountMoney()
          );
        }
      }
    }

    updateEndScene = () => {
      let replay = this.mainStage.getEntityByKeyName("replay");
      if(replay.checkClicked()) {
        this.state.resetGame();
      }
    }

    destroyScene = () => {
      this.mainStage.getDestroyer().push(this.mainStage.getScene());
      this.mainStage.getDestroyer().destroy();
    }


    checkClickedTile = (tiles, entities) => {
        let clickedTile = null;
      
        entities.forEach(entity => {
          if(entity.checkClicked()) {
            clickedTile = tiles.filter(t => t.getId() === entity.getId())[0];
          }
        });
      
        return clickedTile;
    }

    destroyTiles = (group) => {
      let sprites = [];    
      group.forEach(
        g => {
          sprites.push(
            this.mainStage.getEntityById(g.getId())
          );
          
          this.mainStage.destroySptite(g.getId());
    
          let removingTile = this.gameSession.getTiles().filter(t => t.getId() === g.getId())[0];
          this.gameSession.getTiles().splice(this.gameSession.getTiles().indexOf(removingTile), 1);
        } 
      );
      this.managerAnimations.destroySprites(this.mainStage, sprites);    
    }

    generateBomb = (tile) => {
      tile.setBonus("bomb");
      this.mainStage.destroySptite(tile.getId());
      this.drawerGameField.generateEntityForTile(
        this.mainStage, 
        this.storeTextures, 
        tile.getId(),
        tile.getColor(),
        tile.getNumRow(),
        tile.getNumColumn()
      )
      
      this.mainStage.resize();
      this.mainStage.getDestroyer().destroy();
    }

    generateNewTiles = () => {    
      let movedTiles = this.gameSession.moveDownTiles();
      this.managerAnimations.moveTiles(this.mainStage, this.drawerGameField, movedTiles);
    
      let newTiles = this.gameSession.generateTiles();
      let newSprites = [];
      
      newTiles.forEach(t => {
        newSprites.push(
          this.drawerGameField.generateEntityForTile(
            this.mainStage,
            this.storeTextures,
            t.getId(),
            t.getColor(),
            t.getNumRow(),
            t.getNumColumn()
          )
        )        
      });

      this.managerAnimations.emergenceSprites(this.mainStage, newSprites);
    }
}