AFRAME.registerComponent('character', {
    init() {
        console.log('Hello, you cube!');

        this.health = 100;
        this.collisionBodies = [];

        document.addEventListener('keydown', event => {
            const pos = this.el.getAttribute('position')

            if (event.key === 'ArrowLeft') {
                // apply a force in the physics system to move the character
                this.el.body.applyImpulse(
                    /* impulse */        new CANNON.Vec3(-10, 5, 0),
                    /* world position */ new CANNON.Vec3(pos.x + 1, pos.y, pos.z)
                )

            } else if (event.key === 'ArrowRight') {
                // apply a force in the physics system to move the character
                this.el.body.applyImpulse(
                    /* impulse */        new CANNON.Vec3(10, 5, 0),
                    /* world position */ new CANNON.Vec3(pos.x - 1, pos.y, pos.z)
                )
            }

            // grab the camera
            var player = document.querySelector("a-camera")
            // create a direction vector
            var direction = new THREE.Vector3();

            if (e.code === "KeyR") {
                // get the cameras world direction
                this.el.sceneEl.camera.getWorldDirection(direction);
                // multiply the direction by a "speed" factor
                direction.multiplyScalar(0.1)
                // get the current position
                //var pos = player.getAttribute("position")
                // add the direction vector
                pos.add(direction)
                // set the new position
                player.setAttribute("position", pos);
                // !!! NOTE - it would be more efficient to do the
                // position change on the players THREE.Object:
                // `player.object3D.position.add(direction)`
                // but it would break "getAttribute("position")
              }
        })

        this.el.addEventListener('collide', event => {
            const otherEntity = event.detail.body;

            // consider only collisions with obstacles (entities having obstacle component)
            if (!otherEntity.el.hasAttribute('obstacle')) {
                return;
            }

            // do not collide repeatedly with the same entity
            if (this.collisionBodies.includes(otherEntity)) {
                return;
            }

            // add the entity, which we collided with, to the array, so we can avoid another collision with the same entity
            this.collisionBodies.push(otherEntity);

            // if there is a delay of at least 500ms between the collisions, enable collision with the same entity
            // in other words: remove the collided entity from the array after 500ms if no other collisions happen in the meantime
            clearTimeout(this.clearTimeout);
            this.clearTimeout = setTimeout(() =>
                this.collisionBodies.splice(this.collisionBodies.indexOf(otherEntity)),
                500
            );

            // the collision affects the character's health
            this.health -= 40;
            console.log('Health', this.health)

            // if there is no health remaining, the game is over
            if (this.health < 0) {
                document.getElementById('game-over').style.display = 'block';
            }

            // tell the other entity that the collision happened, so it can destroy itself
            otherEntity.el.emit('collide-with-character')
        })
    }
});