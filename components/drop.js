AFRAME.registerComponent('drop', {
    schema: {
        size: {
            type: 'int',
            default: 15
        }
    },
    init() {
        //console.log('Hello, you drop!');

        //this.damage = 0;
        this.hasBeenDestroyed = false;

        /*this.el.addEventListener('collide-with-character', event => {
            this.damage += 60;

            if (this.damage > this.data.strength && !this.hasBeenDestroyed) {
                this.hasBeenDestroyed = true;
                setTimeout(() => this.el.remove(), 0) // must remove the entity in the next frame to prevent error in physics system due to the collision still happening
            }
        })*/
    },
    pickup(el, maxPick) {
        //console.log(el);
        //el.components["character"].getDamage(10);

        if (!this.hasBeenDestroyed) {
            //console.log("pickingup..");
            console.log(maxPick);

            const pickedUp = Math.min(this.data.size, maxPick);
            el.addDump(pickedUp);
            this.data.size -= pickedUp;

            if (this.data.size <= 0) {
                this.hasBeenDestroyed = true;
                setTimeout(() => this.el.remove(), 1) // must remove the entity in the next frame to prevent error in physics system due to the collision still happening
                //console.log("pickedUP!")
            }
        }
    }

});
