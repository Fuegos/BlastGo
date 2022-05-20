export class Destroyer {
    constructor() {
        this.objects = [];
    }

    isDestroyed = () => this.objects.length === 0;

    destroy = () => {
        this.objects.forEach(obj => {
            console.log(obj);
            obj.parent.removeChild(obj);
            let options = {
                children: true
            }

            if(obj.isSprite) {
                options.baseTexture = true;
            }

            obj.destroy(options);
        });

        this.objects = [];
    }

    push = (obj) => this.objects.push(obj);
}