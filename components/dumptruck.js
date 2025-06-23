AFRAME.registerComponent('dumptruck', {
    schema: {
        full: {
            type: 'int',
            default: 0
        },
        max: {
            type: 'int',
            default: 100
        }
    },
    init() {

        this.el.addEventListener('collidestart', event => {
            const otherEntity = event.detail.targetEl;

            // consider only collisions with obstacles (entities having obstacle component)
            if (!otherEntity.hasAttribute('drop')) {
                return;
            }

            
            console.log("DROP COLLISION");
            console.log(otherEntity);

            otherEntity.components["drop"].pickup(this, this.data.max-this.data.full);


        })

        /*console.log('Hello, you drop!');

        this.damage = 0;
        this.hasBeenDestroyed = false;

        this.el.addEventListener('collide-with-character', event => {
            this.damage += 60;

            if (this.damage > this.data.strength && !this.hasBeenDestroyed) {
                this.hasBeenDestroyed = true;
                setTimeout(() => this.el.remove(), 0) // must remove the entity in the next frame to prevent error in physics system due to the collision still happening
            }
        })*/
    },
    /*pickup(el) {
        console.log(el);
        el.components["character"].getDamage(10);

        console.log("pickedUP!")
        if (!this.hasBeenDestroyed) {
            this.hasBeenDestroyed = true;
            setTimeout(() => this.el.remove(), 0) // must remove the entity in the next frame to prevent error in physics system due to the collision still happening
        }
    }*/

    addDump(amount) {
        this.data.full += amount;

        //console.log();
        function updateHealthBar(healthPercent, healthBar) {
            let scale = healthPercent / 100;
            healthBar.setAttribute('scale', `${scale} 1 1`);
            healthBar.setAttribute('position', `${-(1 - scale) / 2} 0 0.01`);
        }

        updateHealthBar(this.data.full, this.el.querySelector('#dump-bar'))
    },
    empty() {
        window.materials += this.data.full;
        document.querySelector("#materials > span").innerHTML = window.materials;
        
        this.data.full = 0;

        function updateHealthBar(healthPercent, healthBar) {
            let scale = healthPercent / 100;
            healthBar.setAttribute('scale', `${scale} 1 1`);
            healthBar.setAttribute('position', `${-(1 - scale) / 2} 0 0.01`);
        }

        updateHealthBar(this.data.full, this.el.querySelector('#dump-bar'))
    }
});
