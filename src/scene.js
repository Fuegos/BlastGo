import { Container } from "pixi.js";
import { Entity } from './entity.js'
import { SpriteEntity } from "./spriteEntity.js";
import { TextEntity } from "./textEntity.js";


export class Scene {
    constructor() {
        this.scene = new Container(); 
        this.entities = [];
        this.textes = [];
    }

    createEntity = (storeTextures, dataSettings, parent) => {
        Object.keys(dataSettings).forEach(key => {
            
            dataSettings[key].entities.forEach(e => {

                let entity = new SpriteEntity(
                    parent,
                    e.indentTop,
                    e.indentLeft,
                    storeTextures.getTexture(key), 
                    e.valueFill
                );

                this.entities.push(entity);
                this.scene.addChild(entity.getEntity());

                if(e.hasOwnProperty('children')) {
                    this.createEntity(storeTextures, e.children, entity.getEntity());
                }
            });

            dataSettings[key].textes.forEach(t => {
                let text = new TextEntity(parent, t.indentTop, t.indentLeft, t.value, t.size);

                this.textes.push(text);
                this.scene.addChild(text.getEntity());
            });
        });
    }

    getEntities = () => this.entities;

    getTextes = () => this.textes;

    getScene = () => this.scene;
}