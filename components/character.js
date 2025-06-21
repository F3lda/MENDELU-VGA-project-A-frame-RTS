AFRAME.registerComponent('character', {
    schema: {
        //destPoint: {default: null}
        health: {type: 'int', default: 100},
        damage: {type: 'int', default: 15},
        attackTime: {type: 'int', default: 1000} //ms
    },
    init() {

        this.attacking = false;

        this.el.addEventListener("body-loaded", e => {
            // cache the ammo-body component
            this.ammoComponent = this.el.components["ammo-body"];
            // use this vector to zero the velocity
            // keep in mind this needs to be deleted manually from the memory with Ammo.destroy(this.zeroSpeed)
            this.zeroSpeed = new Ammo.btVector3(0, 0, 0);
        });

        this.animationRunning = false;
        this.stopAnimation = false;

        this.collision = false;
        this.collisionTimestamp = null;
        this.collisionLastRestackTimeout = 0;
        this.collisionRepthaRunning = false;
        this.collisionDir = null;


        console.log('Hello, character!');

        const speed = 3;
        const diagonalSpeed = Math.sqrt((speed*speed)/2);
        console.log("Diagonal:" + diagonalSpeed);

        this.directions = {
            'back': new CANNON.Vec3(0, 0, speed),
            'backRight': new CANNON.Vec3(diagonalSpeed, 0, diagonalSpeed),
            'right': new CANNON.Vec3(speed, 0, 0),
            'frontRight': new CANNON.Vec3(diagonalSpeed, 0, -diagonalSpeed),
            'front': new CANNON.Vec3(0, 0, -speed),
            'frontLeft': new CANNON.Vec3(-diagonalSpeed, 0, -diagonalSpeed),
            'left': new CANNON.Vec3(-speed, 0, 0),
            'backLeft': new CANNON.Vec3(-diagonalSpeed, 0, diagonalSpeed),
        }

        this.health = 100;
        this.collisionBodies = [];
        this.velocity = null;
        this.rotationY = 0;
        this.direction = 'front';
        this.characterModel = this.el.children[0];
        this.characterModelName = this.el.children[0].getAttribute('gltf-model');
        console.log(this.characterModelName);
        // custom model variables
        this.animationRun = "CharacterArmature|Run";
        this.animationIdle = "CharacterArmature|Idle";
        this.animationAttack = "CharacterArmature|Idle_Shoot";
        this.modelRotationCorrection = 0;

        if (this.characterModelName.includes("Dump_truck.glb")) {
            this.modelRotationCorrection += 180;
        }





        this.recentPositions = [];
        this.maxHistory = 200; // TODO add timeout for saving positions (150 ms)
        this.positionThreshold = 1.01; // how close positions must be to be considered "the same"


        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                this.startRunning('left');
            } else if (event.key === 'ArrowRight') {
                this.startRunning('right');
            } else if (event.key === 'ArrowUp') {
                this.startRunning('front');
            } else if (event.key === 'ArrowDown') {
                this.startRunning('back');
            }
            if (event.code === 'KeyR') {
                var npcEl = this.el;//document.querySelector('#npc');
                npcEl.setAttribute('nav-agent', {
                    active: true,
                    destination: '0 0 0'
                });
            }
        })
        document.addEventListener('keyup', (event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                this.stop();
            }
        })
        this.el.addEventListener('collidestart', event => this.processCollision(event))
    },
    startRunning(direction) {
        this.wakeUp()
        //console.log("running");
        const directions = Object.keys(this.directions);

        var lastRotationY = this.rotationY;
        this.rotationY = directions.indexOf(direction) * 45 + this.modelRotationCorrection;// correction for wrong rotated models
        this.direction = direction;
        this.velocity = this.directions[direction];

        if (lastRotationY != this.rotationY) {
/*
            // rotate from current rotation
            var animationRotationY = this.rotationY;//-lastRotationY;
            // rotate the shortest path
            if (animationRotationY > 180) {
                animationRotationY -= 360;
            } else if (animationRotationY < -180) {
                animationRotationY += 360;
            }
            // pause ammo body because of the rotation
            this.el.components['ammo-body'].pause();
            // start model rotation animation
            this.el.setAttribute('animation', {
                property: 'rotation',
                to: {x: 0, y: animationRotationY, z: 0},
                //to: {x: 0, y: this.rotationY, z: 0},
                dur: 500,
                easing: 'easeOutQuad',
            })


            var _this = this;
            setTimeout(function () {
                // when animation ends -> sync ammo physics
                // set ammo body rotation
                //_this.el.setAttribute('rotation', {x: 0, y: _this.rotationY, z: 0});
                // resume physics
                _this.el.components['ammo-body'].play();
                _this.ammoComponent.syncToPhysics();
                // reset model rotation animation
                //_this.el.setAttribute('animation', {
                //    property: 'rotation',
                //    to: {x: 0, y: 0, z: 0},
                //    dur: 0,
                //    easing: 'easeOutQuad',
                //})
            }, 500);*/


            console.log("Rot: "+this.rotationY);
            this.rotateAmmoBodyToFacing(this.el.body, this.rotationY);
        }

        
        // start the character's animation
        this.characterModel.setAttribute('animation-mixer', {
            clip: this.animationRun,
            crossFadeDuration: 0.2,
        });
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
    stop() {
        // stop moving the object
        this.velocity = null;

        // stop the animation
        this.characterModel.setAttribute('animation-mixer', {
            clip: this.animationIdle,
            crossFadeDuration: 0.2,
        });

        this.stopAnimation = true;
    },
    wakeUp() {
        this.el.body.setActivationState(1); // Wake it up
    },
    moveTo(unit, target, dest) {

        
        this.collision = false;
        this.collisionTimestamp = null;
        this.collisionLastRestackTimeout = 0;
        this.collisionRepthaRunning = false;
        this.collisionDir = null;


        console.log('UNIT: moving to: '+target);

        //this.data.destPoint = dest;
        
        var _this = this;
        if (this.animationRunning) {
            this.stopAnimation = true;
            var intrv = setInterval(function(){
                if (_this.animationRunning == false) {
                    clearInterval(intrv);

                    _this.animationRunning = true;
                    _this.stopAnimation = false;
                    startMovingTo(unit, target);
                }
            }, 20);
        } else {
            this.animationRunning = true;
            this.stopAnimation = false;
            startMovingTo(unit, target);
        }


        function startMovingTo(unit, target) {
            const threshold = 1.6;    // distance at which to stop
            let currentDirection = null;
        
            const directionMap = {
                back:        new THREE.Vector3(0, 0, 1),
                backRight:   new THREE.Vector3(1, 0, 1).normalize(),
                right:       new THREE.Vector3(1, 0, 0),
                frontRight:  new THREE.Vector3(1, 0, -1).normalize(),
                front:       new THREE.Vector3(0, 0, -1),
                frontLeft:   new THREE.Vector3(-1, 0, -1).normalize(),
                left:        new THREE.Vector3(-1, 0, 0),
                backLeft:    new THREE.Vector3(-1, 0, 1).normalize(),
            };

            function getDirectionInDegrees(vector) {
                // Assuming Y-up world and we want horizontal angle
                const rad = Math.atan2(vector.x, vector.z); // Use X and Z for horizontal direction
                let deg = THREE.MathUtils.radToDeg(rad);    // Convert radians to degrees
            
                // Normalize to [0, 360)
                if (deg < 0) deg += 360;
            
                return deg;
            }

            function isNear45Multiple(degrees, threshold = 5) {
                const nearest45 = Math.round(degrees / 45) * 45;
                const diff = Math.abs(degrees - nearest45);
                
                // Account for wrap-around at 360 degrees
                const normalizedDiff = Math.min(diff, 360 - diff);
                return normalizedDiff <= threshold;
            }
        
            const update = () => {
                const pos = unit.object3D.position.clone();
                const distance = pos.distanceTo(target);
                //console.log("distance:");
                //console.log(distance);
                if (distance <= threshold) {
                    _this.stop();
                    _this.animationRunning = false;
                    return;
                }
        
                // Compute normalized direction vector to target
                const dirToTarget = new THREE.Vector3(
                    target.x - pos.x,
                    0,
                    target.z - pos.z
                ).normalize();
        
                // Find the closest predefined direction
                let bestMatch = null;
                let bestDot = -Infinity;
        
                for (const [name, dirVec] of Object.entries(directionMap)) {
                    const dot = dirToTarget.dot(dirVec);
                    if (dot > bestDot) {
                        bestDot = dot;
                        bestMatch = name;
                    }
                }

                // If direction changed, start running in new direction
                //if (!_this.collision && !_this.collisionRepthaRunning && bestMatch !== currentDirection && (isNear45Multiple(getDirectionInDegrees(dirToTarget), 3) || currentDirection == null || _this.collisionTimestamp != 0)) {
                if (bestMatch !== currentDirection && (isNear45Multiple(getDirectionInDegrees(dirToTarget), 3) || currentDirection == null)) {
                    currentDirection = bestMatch;
                    _this.startRunning(currentDirection);
                    console.log("DIR CHANGED");
                    console.log(bestMatch);
                    //_this.collisionTimestamp = 0;
                }
        
                if (_this.stopAnimation) {
                    _this.animationRunning = false;
                    return;
                }


                /*function getNextDirectionName(currentDirectionName, step = 1) {
                    const keys = Object.keys(directionMap);
                    const index = keys.indexOf(currentDirectionName);
                    if (index === -1) {
                        throw new Error(`Invalid direction name: ${currentDirectionName}`);
                    }
                    const nextIndex = (index + step + keys.length) % keys.length;
                    return keys[nextIndex];
                }
                
                if (_this.collision) {
                    _this.collision = false;
                    _this.collisionRepthaRunning = true;

                    
                    _this.collisionTimestamp = new Date().getTime();
                    _this.collisionLastRestackTimeout += 0.5;
                    console.log(_this.collisionLastRestackTimeout);

                    if (_this.collisionDir == bestMatch) {
                        _this.collisionDir = getNextDirectionName(bestMatch)
                    } else if (_this.collisionDir == null) {
                        _this.collisionDir = bestMatch;
                    }

                    _this.collisionDir = getNextDirectionName(_this.collisionDir);
                    //_this.collisionDir = getNextDirectionName(getNextDirectionName(_this.collisionDir));
                    _this.startRunning(_this.collisionDir);
                    console.log("DIR CHANGED - collision: "+((new Date().getTime()) - _this.collisionTimestamp));
                }
                
                if (_this.collisionRepthaRunning && ((new Date().getTime()) - _this.collisionTimestamp > _this.collisionLastRestackTimeout)) {
                    _this.collisionRepthaRunning = false;
                    _this.startRunning(bestMatch);
                    console.log("collision WAS: "+((new Date().getTime()) - _this.collisionTimestamp));
                }*//* else if(_this.collisionTimestamp != 0) {
                    currentDirection = bestMatch;
                    _this.startRunning(currentDirection);
                    console.log("DIR CHANGED");
                    console.log(bestMatch);
                    _this.collisionTimestamp = 0;
                }*/
                

                /*if (_this.collision) {
                    _this.collision = false;
                    clearTimeout(_this.collisionTimeout);
                    _this.collisionTimeout = setTimeout(() => requestAnimationFrame(update), 300);
                } else {*/
                    //console.log("COLrun")
                    requestAnimationFrame(update);
                //}
            };
        
            update();
        }
    },
    tick() {
        /*if (this.velocity !== null) {
            // constantly update the velocity of the character to the speed of the movement
            // bypasses friction slowing down the character
            // do not update Y to avoid interference with the physics gravity
            this.el.body.velocity.x = this.velocity.x
            this.el.body.velocity.z = this.velocity.z
        }*/
        if (this.velocity !== null) {
            // constantly update the velocity of the character to the speed of the movement
            // bypasses friction slowing down the character
            // do not set y axis velocity, because it is already set by the physics system (gravity)
            // this.el.body.velocity.x = this.velocity.x
            // this.el.body.velocity.z = this.velocity.z
            let currentVelocity = this.el.body.getLinearVelocity();
            let newVelocity = new Ammo.btVector3(this.velocity.x, currentVelocity.y(), this.velocity.z);  // Set X to 10, keep Y and Z as they are
            this.el.body.setLinearVelocity(newVelocity);
            this.el.body.setFriction(2)

            //console.log("running");
            //console.log(this.velocity)
            //console.log(newVelocity)


            /*************** STUCK CHECK *****************/                
            var _this = this;
            
            function updateRecentPositions(currentPos) {
                _this.recentPositions.push(currentPos.clone());

                // Keep only the last 10 positions
                if (_this.recentPositions.length > _this.maxHistory) {
                    _this.recentPositions.shift();
                }
            }

            function isStuckInPlace() {
                if (_this.recentPositions.length < _this.maxHistory) return false;

                const reference = _this.recentPositions[0];

                return _this.recentPositions.every(pos => pos.distanceTo(reference) < _this.positionThreshold);
            }
            
            const currentPos = this.el.object3D.position;
            updateRecentPositions(currentPos);
            //console.log(currentPos);

            if (isStuckInPlace() && this.animationRunning) {// && !this.collision && !this.collisionRepthaRunning
                _this.recentPositions = [];
                console.log("Character is stuck — try rotating direction or re-pathing.");
                // Insert logic to change direction or try alternative movement
                //this.collision = true;
                this.stop();
            }

        }



        if (this.characterModelName.includes("Character_Soldier.glb")) {// only soldiers can attack

            // Get current entity's world position
            const currentPosition = new THREE.Vector3();
            this.el.object3D.getWorldPosition(currentPosition);

            // Query all enemy entities
            const enemies = document.querySelectorAll('[enemy]');

            enemies.forEach(enemyEl => {
                //if (enemyEl === this.el) return; // Skip if it's the same entity

                const enemyPosition = new THREE.Vector3();
                enemyEl.object3D.getWorldPosition(enemyPosition);

                const distance = currentPosition.distanceTo(enemyPosition);

                if (distance.toFixed(2) < 10.0 && this.animationRunning == false) {
                    //console.log(`Distance to enemy [id=${enemyEl.id || 'unknown'}]: ${distance.toFixed(2)} units`);
                    
                    this.attackEnemy(enemyEl);
                }
            });
        }


    },
    getDamage(damage) {

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
        }
    },
    changeSelection(selected) {
        //console.log("change selection: "+ selected);
        const healthBarEntity = this.el.querySelector('#health-bar').parentElement;
        if (selected){
            healthBarEntity.setAttribute("visible", true);
        } else {
            healthBarEntity.setAttribute("visible", false);
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
                bullet.setAttribute('bullet', {dir: direction, damage: _this.data.damage, attacker: 'player'});
                
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
    processCollision(event) {
        


        const otherEntity = event.detail.targetEl;

        // consider only collisions with obstacles (entities having obstacle component)
        if (!otherEntity.hasAttribute('drop')) {
            return;
        }


        otherEntity.components["drop"].pickup(this.el);


console.log("DROP COLLISION");
return;
        // consider only collisions with obstacles (entities having obstacle component)
        if (!otherEntity.el.hasAttribute('obstacle') && !otherEntity.el.hasAttribute('character')) {
            return;
        }

        // do not collide repeatedly with the same entity
        if (this.collisionBodies.includes(otherEntity)) {
            return;
        }

        // add the entity, which we collided with, to the array, so we can avoid another collision with the same entity
        this.collisionBodies.push(otherEntity);

        // if there is a delay of at least 500ms between the collisions, enable repeated collision with the same entity
        // in other words: remove the collided entity from the array after 500ms if no other collisions happen in the meantime
        clearTimeout(this.clearTimeout);
        this.clearTimeout = setTimeout(() =>
                this.collisionBodies.splice(0, this.collisionBodies.length),
            500
        );






        /*if (otherEntity.el.hasAttribute('obstacle')) {

            const currentPos = this.el.object3D.position;
            updateRecentPositions(currentPos);
            //console.log(currentPos);

            if (isStuckInPlace() && this.animationRunning && !this.collision && !this.collisionRepthaRunning) {
                _this.recentPositions = [];
                console.log("Character is stuck — try rotating direction or re-pathing.");
                // Insert logic to change direction or try alternative movement
                //this.collision = true;
                this.stop();
            }

        } else*/ if (otherEntity.el.hasAttribute('character')) {

            /*if (otherEntity.el.getAttribute('character').destPoint == this.data.destPoint) {
                console.log("same target point!");
                this.collision = true;
            }*/
        }

        // the collision affects the character's health
        //this.health -= 40;
        //console.log('Health', this.health)

        // if there is no health remaining, the game is over
        //if (this.health < 0) {
            //document.getElementById('game-over').style.display = 'block';
        //}

        // tell the other entity that the collision happened, so it can destroy itself
        //otherEntity.el.emit('collide-with-character')
    },
});