import { Container } from "pixi.js";
import { Entity } from './entity.js'


export class Scene {
    constructor() {
        this.scene = new Container(); 
        this.entities = [];
    }

    createEntity = (storeTextures, dataSettings, parent) => {
        Object.keys(dataSettings).forEach(key => {
            
            let entity = new Entity(
                storeTextures.getTexture(key), 
                dataSettings[key].valueFill, 
                parent,
                dataSettings[key].indentTop,
                dataSettings[key].indentLeft
            );

            this.entities.push(entity);
            this.scene.addChild(entity.getSprite());
            
            if(dataSettings[key].hasOwnProperty('children')) {
                this.createEntity(storeTextures, dataSettings[key].children, entity.getSprite());
            }
        });
    }

    getEntities = () => this.entities;

    getScene = () => this.scene;
}