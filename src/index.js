import { Application } from "pixi.js";
import { ManagerScenes } from "./client/managerScenes.js";
import { StoreTextures } from './loader.js'

const app = new Application({
  resizeTo: window,
  backgroundColor: 0xa1a1a1,
  view: document.querySelector('#scene')
});

let storeTextures = new StoreTextures();

storeTextures.build().then(() => {  

  let managerScenes = new ManagerScenes(storeTextures);
  managerScenes.createSceneGame();
  app.stage.addChild(managerScenes.getMainStage().getScene());

  
  app.ticker.add((deltaTime) => {
    if(!managerScenes.getState().checkInterceptAnimation()) {

      if(managerScenes.getState().checkChangeScene()) {
        managerScenes.destroyScene();
        if(managerScenes.getState().checkGameOver()) {
          managerScenes.createSceneGameOver();
        } else if(managerScenes.getState().checkWinning()) {
          managerScenes.createSceneWinning();
        } else if (managerScenes.getState().checkGame()) {
          managerScenes.createSceneGame();
        }
        
        app.stage.addChild(managerScenes.getMainStage().getScene());
        managerScenes.getState().uncheck();
      }

      if(managerScenes.getState().checkWinning()) {
        managerScenes.updateEndScene();
      } else if(managerScenes.getState().checkGameOver()) {
        managerScenes.updateEndScene();
      } else if(managerScenes.getState().checkGame()) {
        managerScenes.updateSceneGame();
      }
    }

    if (managerScenes.getMainStage().getQueueAnimations().checkIntercept()) {
      managerScenes.getState().interceptAnimation();
    } else {
      managerScenes.getState().stopInterceptAnimation();
    }

    managerScenes.getMainStage().getQueueAnimations().animate(deltaTime);

    managerScenes.getMainStage().unclickingAll();
  });
});












