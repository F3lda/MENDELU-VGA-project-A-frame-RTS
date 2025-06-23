AFRAME.registerComponent('bullet', {
    dependencies: ['raycaster'],
    schema: {
        dir: {default: ''},
        damage: {type: 'int'},
        attacker: {type: 'string'}
    },
    init: function () {
        this.el.addEventListener('raycaster-intersection', event => {
            console.log('Bullet hit something! intersection', event.detail.els);
            console.log(event.detail.els[0]);

            try {
            event.detail.els.forEach((item) => {
                const elem = item.parentElement;
                if (elem.hasAttribute("enemy") && this.data.attacker == 'player') {
                    elem.components["enemy"].getDamage(this.data.damage);
                            
                    // remove bullet
                    setTimeout(() => this.el.remove(), 1);

                    throw new Error(); // break 
                } else if (elem.hasAttribute("character") && this.data.attacker == 'enemy') {
                    elem.components["character"].getDamage(this.data.damage);
                    
                    // remove bullet
                    setTimeout(() => this.el.remove(), 1);

                    throw new Error(); // break 
                }
                console.log(item);
            });
            } catch (e) {
            }

        });


        // This will be called after the entity has properly attached and loaded.
        const bullet = this.el;
        // first move
        console.log("bullet out! "+this.data.attacker);
        const pos = bullet.getAttribute('position')
        pos.add(this.data.dir)


        /*bullet.addEventListener("collide", (e) => {
            console.log("bullet collision");
            const hitEl = e.detail.body.el;

            if (hitEl && hitEl.classList.contains("target")) {
                hitEl.setAttribute("color", "black"); // hit response
                //setTimeout(() => hitEl.remove(), 500); // remove after hit
            }
            //bullet.remove(); // Remove bullet after collision
            setTimeout(() => bullet.remove(), 1);
        });
        
        bullet.addEventListener("collisions", (e)=>{
            // collision!
            console.log("bullet collision 2");
        })*/
        
        // movement
        const intrvl = setInterval(() => {
            pos.add(this.data.dir)
        }, 1);

        // Clean up bullet after timeout if no hit
        setTimeout(() => {
            if (bullet.parentNode) bullet.remove();
            clearInterval(intrvl);
        }, 1900);
    }
});
/*
AFRAME.registerComponent('bullet-collider-check', {
    dependencies: ['raycaster'],

    init() {
        this.el.addEventListener('raycaster-intersection', event => {
            console.log('Bullet hit something! intersection', event.detail.els);
        });
    }
});
*/