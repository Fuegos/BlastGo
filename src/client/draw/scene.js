import { Container } from "pixi.js";
import { SpriteEntity } from "./spriteEntity.js";
import { QueueAnimations } from "../animation/queueAnimations";
import { TextEntity } from "./textEntity.js";
import { v4 as uuidv4 } from 'uuid';
import { Destroyer } from "./Destroyer.js";


export class Scene {
    constructor() {
        this.scene = new Container(); 
        this.sprites = [];
        this.spriteForDestroy = [];
        this.textes = [];
        this.queueAnimations = new QueueAnimations();
        this.destroyer = new Destroyer();
    }

    createEntities = (storeTextures, dataSettings, parent) => {
        Object.keys(dataSettings).forEach(key => {
            
            dataSettings[key].sprites.forEach(e => {

                let sprite = new SpriteEntity(
                    uuidv4(),
                    key,
                    parent,
                    storeTextures.getTexture(key),
                    {
                        "laptop": e.laptop,
                        "mobile": e.mobile
                    }
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
                    e.textValue, 
                    e.value,
                    {
                        "laptop": e.laptop,
                        "mobile": e.mobile
                    }
                );

                this.textes.push(text);
                this.scene.addChild(text.getEntity());
            });
        });
    }

    createSpriteEntity = (storeTextures, id, key, drawSettings, parent) => {
        let sprite = new SpriteEntity(
            id,
            key,
            parent,
            storeTextures.getTexture(key),
            drawSettings
        );

        this.sprites.push(sprite);
        this.scene.addChild(sprite.getEntity());

        return sprite;
    }

    getSprites = () => this.sprites;

    getTextes = () => this.textes;

    getEntities = () => this.sprites.concat(this.textes);

    getScene = () => this.scene;

    getEntityByKeyName = (keyName) => this.getEntities().filter(e => e.getKeyName() === keyName)[0];

    getEntityById = (id) => this.getEntities().filter(e => e.getId() === id)[0];

    destroySptite = (idSprite) => {
        let spriteEntity = this.getEntityById(idSprite);
        //console.log(spriteEntity);

        this.spriteForDestroy.push(spriteEntity);
        this.destroyer.push(spriteEntity.getEntity());
    }

    destroy = () => {
        if(this.destroyer.isDestroyed()) {
            this.spriteForDestroy.forEach(s => {
                this.sprites.splice(this.sprites.indexOf(s), 1);
            })
            this.spriteForDestroy = [];
        }
        this.destroyer.destroy();
    }

    unclickingAll = () => {
        this.sprites.forEach(e => {
            e.unclicking();
        });
    }

    getQueueAnimations = () => this.queueAnimations;

    getDestroyer = () => this.destroyer;
}