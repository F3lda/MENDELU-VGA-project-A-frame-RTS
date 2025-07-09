AFRAME.registerComponent('silo', {
    dependencies: ['raycaster'],
    schema: {
    },
    init: function () {
        this.el.addEventListener('raycaster-intersection', event => {
            console.log('Silo hit something! intersection', event.detail.els);
            //console.log(event.detail.els[0]);

            const elem = event.detail.els[0].parentElement;
            if (elem.hasAttribute("dumptruck")) {
                console.log(elem);
                elem.components["dumptruck"].empty();
            }
/*
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
            }*/

        });


    }
});
