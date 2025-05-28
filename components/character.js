AFRAME.registerComponent('character', {
    schema: {
        destPoint: {default: null}
    },
    init() {

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
        this.rotationY = 90;
        this.direction = 'right';
        this.characterModel = this.el.children[0];

        this.recentPositions = [];
        this.maxHistory = 50;
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

        this.rotationY = directions.indexOf(direction) * 45;
        this.direction = direction;
        this.velocity = this.directions[direction];


        //this.el.setAttribute('rotation', '0 0 0')


        // rotate the character to the correct direction of movement
        this.characterModel.setAttribute('animation', {
            property: 'rotation',
            to: {x: 0, y: this.rotationY, z: 0},
            dur: 500,
            easing: 'easeOutQuad',
        })

        // start the character's animation
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'run',
            crossFadeDuration: 0.2,
        });
    },
    stop() {
        // stop moving the object
        this.velocity = null;

        // stop the animation
        this.characterModel.setAttribute('animation-mixer', {
            clip: 'idle',
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

        this.data.destPoint = dest;
        
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
    },

    processCollision(event) {
        
return;


console.log("collision")
                
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



return;







        const otherEntity = event.detail.body;



//console.log("COLLISION");
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