import { Container } from "pixi.js";
import { SpriteEntity } from "./spriteEntity.js";
import { TextEntity } from "./textEntity.js";
import { v4 as uuidv4 } from 'uuid';


export class Scene {
    constructor() {
        this.scene = new Container(); 
        this.sprites = [];
        this.textes = [];
        this.movementAnimations = [];
    }

    createEntities = (storeTextures, dataSettings, parent) => {
        Object.keys(dataSettings).forEach(key => {
            
            dataSettings[key].sprites.forEach(e => {

                let sprite = new SpriteEntity(
                    uuidv4(),
                    key,
                    parent,
                    e.indentTop,
                    e.indentLeft,
                    storeTextures.getTexture(key), 
                    e.valueFill
                );

                this.sprites.push(sprite);
                this.scene.addChild(sprite.getEntity());

                if(e.hasOwnProperty('children')) {
                    this.createEntities(storeTextures, e.children, sprite.getEntity());
                }
            });

            dataSettings[key].textes.forEach(e => {
                let text = new TextEntity(
                    uuidv4(),
                    key, 
                    parent, 
                    e.indentTop, 
                    e.indentLeft,
                    e.textValue, 
                    e.value, 
                    e.size
                );

                this.textes.push(text);
                this.scene.addChild(text.getEntity());
            });
        });
    }

    createSpriteEntity = (storeTextures, id, key, settings, parent) => {
        let sprite = new SpriteEntity(
            id,
            key,
            parent,
            settings.indentTop,
            settings.indentLeft,
            storeTextures.getTexture(key), 
            settings.valueFill
        );

        this.sprites.push(sprite);
        this.scene.addChild(sprite.getEntity());
        sprite.resize();
        sprite.setPosition();
    }

    getSprites = () => this.sprites;

    getTextes = () => this.textes;

    getEntities = () => this.sprites.concat(this.textes);

    getScene = () => this.scene;

    getEntityByKeyName = (keyName) => this.getEntities().filter(e => e.getKeyName() === keyName)[0];

    getEntityById = (id) => this.getEntities().filter(e => e.getId() === id)[0];

    destroySptite = (idSprite) => {
        let sprite = this.sprites.filter(s => s.getId() === idSprite)[0];
        this.sprites.splice(this.sprites.indexOf(sprite), 1);
        this.scene.removeChild(sprite.getEntity());
        sprite.getEntity().destroy({children:true, baseTexture:true});
    }

    unclickingAll = () => {
        this.sprites.forEach(e => {
            e.unclicking();
        });
    }
}