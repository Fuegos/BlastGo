import { Application, Container } from "pixi.js";
import { StoreTextures } from './loader.js'
import { Scene } from "./scene.js";
import settings from "./settings"


const minN = 5;
const maxN = 10;
const N = Math.floor(Math.random() * (maxN - minN + 1)) + minN;

const minM = 5;
const maxM = 10;
const M = Math.floor(Math.random() * (maxM - minM + 1)) + minM;

const minC = 2;
const maxC = 5;
const C = Math.floor(Math.random() * (maxC - minC + 1)) + minC;

const COLORS = ['blue', 'red', 'purple', 'yellow', 'green'];

const DICTONARY_COLORS = {
  "blue": "blockBlue",
  "red": "blockRed",
  "yellow": "blockYellow",
  "purple": "blockPurple",
  "green": "blockGreen"
};

const X = 20; // move
const Y = 2000; // score 
const BANK = 15; // count money

const generateRandomColors = (count) => COLORS.sort(() => 0.5 - Math.random()).slice(0, count);

const getRandomColor = (arr) => arr[Math.floor(Math.random() * arr.length)];


const app = new Application({
  resizeTo: window,
  backgroundColor: 0xa1a1a1,
  view: document.querySelector('#scene')
});

let storeTextures= new StoreTextures();

storeTextures.build().then(() => {  
  let sceneGame = new Scene();

  let arrColors = generateRandomColors(C);

  for(let i = 0; i < N; i++) {
    for(let j = 0; j < M; j++) {
      let color = getRandomColor(arrColors);
      settings.game.gameField.entities[0].children[DICTONARY_COLORS[color]].entities.push(
        {
          "valueFill": 1 / M,
          "indentTop": i / N,
          "indentLeft": j / M
        }
      );
    }
  }


  sceneGame.createEntity(storeTextures, settings["game"], null);
  app.stage.addChild(sceneGame.getScene());

  sceneGame.getEntities().forEach(e => {
    console.log(e);
    e.resize();
    e.setPosition();
  });

  sceneGame.getTextes().forEach(t => {
    t.setPosition();
  });

  window.onresize = () => {
    sceneGame.getEntities().forEach(e => {
      e.resize();
      e.setPosition();
    });

    sceneGame.getTextes().forEach(t => {
      t.setPosition();
    });
  };

});


app.ticker.add((time) => {
  //console.log(storeTextures.loader.progress)
});


