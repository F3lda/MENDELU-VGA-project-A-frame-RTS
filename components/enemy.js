AFRAME.registerComponent('enemy', {
    schema: {
        //destPoint: {default: null}
        health: {type: 'int', default: 100},
        damage: {type: 'int', default: 15},
        attackTime: {type: 'int', default: 1000} //ms
    },
    init() {
        this.attacking = false;

        this.characterModel = this.el.children[0];
        this.characterModelName = this.el.children[0].getAttribute('gltf-model');

        this.animationRun = "CharacterArmature|Run";
        this.animationIdle = "CharacterArmature|Idle";
        this.animationAttack = "CharacterArmature|Idle_Shoot";
    },
    tick() {
        

        if (this.characterModelName.includes("#enemy")) {// only enemy can attack

            // Get current entity's world position
            const currentPosition = new THREE.Vector3();
            this.el.object3D.getWorldPosition(currentPosition);

            // Query all character entities
            const enemies = document.querySelectorAll('[character]');

            enemies.forEach(enemyEl => {
                //if (enemyEl === this.el) return; // Skip if it's the same entity

                const enemyPosition = new THREE.Vector3();
                enemyEl.object3D.getWorldPosition(enemyPosition);

                const distance = currentPosition.distanceTo(enemyPosition);

                if (distance.toFixed(2) < 10.0) { // && this.animationRunning == false
                    //console.log(`Distance to enemy [id=${enemyEl.id || 'unknown'}]: ${distance.toFixed(2)} units`);
                    
                    this.attackEnemy(enemyEl);
                }
            });
        }
    },
    getDamage(damage) {

        if (this.data.health <= 0) {return;} // skip multiple drop

        function updateHealthBar(healthPercent, healthBar) {
            let scale = healthPercent / 100;
            healthBar.setAttribute('scale', `${scale} 1 1`);
            healthBar.setAttribute('position', `${-(1 - scale) / 2} 0 0.01`);
        }

        //console.log("DAMAGE: "+damage);

        this.data.health = Math.max(this.data.health-damage, 0);
        //if (this.data.health < 0) {this.data.health = 0;}
        updateHealthBar(this.data.health, this.el.querySelector('#health-bar'))

        // damage <= 0 -> kill and drop
        if (this.data.health <= 0) {

            this.characterModel.setAttribute('animation-mixer', {
                clip: 'CharacterArmature|Death',
                crossFadeDuration: 0.2,
            });
            setTimeout(() => this.el.remove(), 500);

            // drop
            const camera = this.el;
            const scene = camera.sceneEl;
            /*const bullet = document.createElement("a-sphere");
            bullet.setAttribute("radius", 0.5);
            bullet.setAttribute("color", "orange");

            // Set bullet's starting position at camera
            bullet.setAttribute('position', camera.getAttribute('position'));

            // Add ammo.js rigid body
            bullet.setAttribute("ammo-body", "type: dynamic; mass: 0.1; shape: sphere; emitCollisionEvents: true;");
            bullet.setAttribute("ammo-shape", "type: box;");

            bullet.setAttribute('drop', {size: 20});*/

            const bullet = document.createElement("a-drop");
            // Set bullet's starting position at camera
            bullet.setAttribute('position', camera.getAttribute('position'));
            bullet.setAttribute('drop', {size: 20});
            
            scene.appendChild(bullet);
            console.log(bullet);
        }
    },
    attackEnemy(target) {
        if (this.attacking == false) {
            this.attacking = true;
            console.log("atack on enemy:");
            console.log(target)



            // move until raycaster can see enemy or is in distance
            // TODO



            function getDirectionDegrees(el1, el2) {
                // Get world positions
                const pos1 = new THREE.Vector3();
                const pos2 = new THREE.Vector3();
              
                el1.object3D.getWorldPosition(pos1);
                el2.object3D.getWorldPosition(pos2);
              
                // Compute direction vector
                const dir = new THREE.Vector3().subVectors(pos2, pos1);
              
                // Get yaw angle in radians (XZ plane)
                const angleRad = Math.atan2(dir.x, dir.z);
              
                // Convert to degrees
                const angleDeg = THREE.MathUtils.radToDeg(angleRad);
              
                // Normalize to [0, 360]
                return (angleDeg + 360) % 360;
            }

            // rotate towards enemy
            var direction = getDirectionDegrees(this.el, target);
            console.log(direction);
            this.rotateAmmoBodyToFacing(this.el.body, direction);



            var _this = this;
            // --- Bullet ---
            setTimeout(function () {
                const camera = _this.el;
                const scene = camera.sceneEl;
                const bullet = document.createElement("a-sphere");
                bullet.setAttribute("radius", 0.1);
                bullet.setAttribute("color", "black");

                // Set bullet's starting position at camera
                //const camPosition = camera.object3D.getWorldPosition(new THREE.Vector3());
                const camPosition = camera.getAttribute('position');
                //bullet.setAttribute("position", `${camPosition.x} ${camPosition.y} ${camPosition.z}`);
                bullet.setAttribute('position', camera.getAttribute('position'));

                // Add ammo.js rigid body
                bullet.setAttribute("ammo-body", "type: static; mass: 0.1; shape: sphere; emitCollisionEvents: true;");

                //bullet.setAttribute('static-body', 'mass: 0.1; shape: sphere;');
                //bullet.setAttribute('ammo-body', 'type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true;');
                
                
                // Get camera's forward direction
                direction = new THREE.Vector3();
                camera.object3D.getWorldDirection(direction);
                direction.multiplyScalar(0.3); // bullet speed

                /*bullet.addEventListener("load", () => {
                console.log("body-loaded");
                bullet.body.velocity.set(direction.x, direction.y, direction.z);
                });*/
                console.log(camera.getAttribute("rotation").y);
                
                
                //bullet.setAttribute('bullet-collider-check', '');
                bullet.setAttribute('rotation', camera.getAttribute("rotation"));
                bullet.setAttribute('raycaster', 'objects: .target; showLine: true; far: 0.3;');
                bullet.setAttribute('bullet', {dir: direction, damage: _this.data.damage, attacker: 'enemy'});
                
                scene.appendChild(bullet);

                // start the character's animation
                _this.characterModel.setAttribute('animation-mixer', {
                    clip: _this.animationAttack,
                    crossFadeDuration: 0.2,
                });
                // start the character's animation
                _this.characterModel.setAttribute('animation-mixer', {
                    clip: _this.animationIdle,
                    crossFadeDuration: 0.2,
                });

            }, (this.attackLastDirection == direction) ? 1 : 500); // rotation time
            this.attackLastDirection = direction;

            setTimeout(function () {
                _this.attacking = false;
            }, this.data.attackTime);
        }
    },
    rotateAmmoBodyToFacing(body, angleDegrees, duration = 500) {
        const startTime = performance.now();

        // Convert angle to radians
        const angleRad = THREE.MathUtils.degToRad(angleDegrees);
      
        // Get current transform and rotation
        const transform = new Ammo.btTransform();
        body.getMotionState().getWorldTransform(transform);
        const ammoQuat = transform.getRotation();
      
        const currentQuat = new THREE.Quaternion(
          ammoQuat.x(),
          ammoQuat.y(),
          ammoQuat.z(),
          ammoQuat.w()
        );
      
        // Target rotation (around Y-axis)
        const yAxis = new THREE.Vector3(0, 1, 0);
        const targetQuat = new THREE.Quaternion().setFromAxisAngle(yAxis, angleRad);
      
        const intermediateQuat = new THREE.Quaternion();
      
        // Easing function: easeInOutQuad
        function easeInOutQuad(t) {
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
      
        // Animation loop
        function animate(time) {
            const elapsed = time - startTime;
            const tRaw = Math.min(elapsed / duration, 1);       // linear time
            const t = easeInOutQuad(tRaw);                      // eased time
        
            intermediateQuat.copy(currentQuat).slerp(targetQuat, t);
        
            const newBtQuat = new Ammo.btQuaternion(
                intermediateQuat.x,
                intermediateQuat.y,
                intermediateQuat.z,
                intermediateQuat.w
            );
        
            transform.setRotation(newBtQuat);
            body.setWorldTransform(transform);
            body.getMotionState().setWorldTransform(transform);
        
            Ammo.destroy(newBtQuat);
        
            if (tRaw < 1) {
                requestAnimationFrame(animate);
            } else {
                Ammo.destroy(ammoQuat);
                Ammo.destroy(transform);
            }
        }
      
        requestAnimationFrame(animate);
    },
});
