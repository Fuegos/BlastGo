import { MovementAnimation } from "./animation/movementAnimation.js";
import { TextAnimation } from "./animation/textAnimation.js";
import { AlphaAnimation } from "./animation/alphaAnimation.js";
import { ProgressAnimation } from "./animation/progressAnimation.js";

export class ManagerAnimations {
    constructor() {}

    updateText = (scene, keyName, time, curValue, goalValue) => {
        let textEntity = scene.getEntityByKeyName(keyName);
        
        scene.getQueueAnimations().pushAsync(
            new TextAnimation(
                textEntity,
                time,
                false,
                curValue,
                goalValue
            )
        );
    }

    updateProgress = (scene, curProgress, goalProgress) => {
        let spriteProgress = scene.getEntityByKeyName("progressFront");

        scene.getQueueAnimations().pushAsync(
          new ProgressAnimation(
            spriteProgress,
            50,
            false,
            curProgress,
            goalProgress
          )
        );
    }

    moveTiles = (scene, drawerGameField, tiles) => {
      let animations = [];

      tiles.forEach(t => {
        let spriteTile = scene.getEntityById(t.getId());

        animations.push(
          new MovementAnimation(
            spriteTile,
            30,
            true,
            spriteTile.getPositioner().getIndentLeft(),
            spriteTile.getPositioner().getIndentTop(),
            drawerGameField.calcIndentLeft(t.getNumColumn()),
            drawerGameField.calcIndentTop(t.getNumRow())
          )
        );
      });
      
      scene.getQueueAnimations().pushNewGroup(animations);
    }

    emergenceSprites = (scene, sprites) => {
      let animations = [];

      sprites.forEach(s => {
        animations.push(
          new AlphaAnimation(s, 20, true, true)
        );
      });

      scene.getQueueAnimations().pushNewGroup(animations);
    }

    destroySprites = (scene, sprites) => {
      let animations = [];

      sprites.forEach(s => {
        animations.push(
          new AlphaAnimation(s, 20, true, false)
        );
      });

      scene.getQueueAnimations().pushNewGroup(animations);
    }
}