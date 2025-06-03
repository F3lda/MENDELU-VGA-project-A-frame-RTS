AFRAME.registerComponent('drop', {
    schema: {
        strength: {
            type: 'int',
            default: 100
        }
    },
    init() {
        console.log('Hello, you drop!');

        this.damage = 0;
        this.hasBeenDestroyed = false;

        this.el.addEventListener('collide-with-character', event => {
            this.damage += 60;

            if (this.damage > this.data.strength && !this.hasBeenDestroyed) {
                this.hasBeenDestroyed = true;
                setTimeout(() => this.el.remove(), 0) // must remove the entity in the next frame to prevent error in physics system due to the collision still happening
            }
        })
    },
    pickup(el) {
        console.log(el);
        el.components["character"].getDamage(10);

        console.log("pickedUP!")
        if (!this.hasBeenDestroyed) {
            this.hasBeenDestroyed = true;
            setTimeout(() => this.el.remove(), 0) // must remove the entity in the next frame to prevent error in physics system due to the collision still happening
        }
    }

});
