AFRAME.registerComponent('unit', {
    init() {
        this.animationRunning = false;
        this.stopAnimation = false;

        console.log('Hello, you unit!');
    },

    moveTo(unit, point) {
        console.log('UNIT: moving to: '+point);
        
        var _this = this;
        if (this.animationRunning) {
            this.stopAnimation = true;
            var intrv = setInterval(function(){
                if (_this.animationRunning == false) {
                    clearInterval(intrv);

                    _this.animationRunning = true;
                    _this.stopAnimation = false;
                    moveUnitTo(unit, point, _this);
                }
            }, 20);
        } else {
            this.animationRunning = true;
            this.stopAnimation = false;
            moveUnitTo(unit, point, this);
        }



        

        function moveUnitTo(unit, target, _this) {
            const speed = 0.2;
            const lookAheadDistance = 1.5;
            const avoidanceStrength = 1.0;
            const seekStrength = 1.0;
            const stuckThreshold = 10; // Increase to 10 to detect stuck state over a longer period
            const unstuckForceStrength = 2.0; // Strength of force to get unstuck
            const stuckAvoidanceMultiplier = 2.5; // Multiply avoidance force when stuck
        
            const unitGeometry = unit.getAttribute('geometry') || {};
            const unitWidth = unitGeometry.width || 1;
            const unitHeight = unitGeometry.height || 1;
            const unitDepth = unitGeometry.depth || 1;
        
            const endPos = new THREE.Vector3(target.x, target.y, target.z);
        
            let previousPos = unit.object3D.position.clone();
            let stuckCounter = 0;
            let stuckCounterMax = 0;
            let stopMovement = false; // Flag to stop movement when stuck for too long

            let positionHistory = [];
            const positionHistoryMaxLength = 30;
            const positionRepeatingMaxCount = 3;

        
            function seek(currentPos) {
                return endPos.clone().sub(currentPos).normalize().multiplyScalar(seekStrength);
            }
        
            function avoid(currentPos, moveDir) {
                const futurePos = currentPos.clone().add(moveDir.clone().multiplyScalar(lookAheadDistance));
                const allObstacles = Array.from(document.querySelectorAll('.obstacle'));
                let totalAvoidance = new THREE.Vector3();
        
                allObstacles.forEach(obstacle => {
                    const obsPos = obstacle.object3D.position.clone();
                    const obsGeom = obstacle.getAttribute('geometry') || {};
                    const obsWidth = obsGeom.width || 1;
                    const obsHeight = obsGeom.height || 1;
                    const obsDepth = obsGeom.depth || 1;
        
                    const isCollisionLikely = checkBoundingBoxCollision(
                        futurePos, unitWidth, unitHeight, unitDepth,
                        obsPos, obsWidth, obsHeight, obsDepth
                    );
        
                    if (isCollisionLikely) {
                        const away = futurePos.clone().sub(obsPos).normalize();
                        const distance = futurePos.distanceTo(obsPos);
                        const strength = avoidanceStrength / Math.max(distance, 0.1);
                        totalAvoidance.add(away.multiplyScalar(strength));
                    }
                });
        
                return totalAvoidance;
            }
        
            function applyUnstuckForce() {
                // Apply a force to move the unit away from the stuck position
                // Let's apply a force in the opposite direction of the closest obstacle
        
                const allObstacles = Array.from(document.querySelectorAll('.obstacle'));
                let closestObstacle = null;
                let closestDistance = Infinity;
        
                allObstacles.forEach(obstacle => {
                    const obsPos = obstacle.object3D.position.clone();
                    const distance = unit.object3D.position.distanceTo(obsPos);
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestObstacle = obstacle;
                    }
                });
        
                if (closestObstacle) {
                    // Push the unit away from the closest obstacle
                    const obsPos = closestObstacle.object3D.position.clone();
                    const away = unit.object3D.position.clone().sub(obsPos).normalize();
                    return away.multiplyScalar(unstuckForceStrength);
                }
        
                return new THREE.Vector3(0, 0, 0); // Default no force
            }

            function positionsAreRepeating(positions) {
                const countMap = new Map();
            
                for (let pos of positions) {
                    const key = `${pos.x.toFixed(positionRepeatingMaxCount)},${pos.y.toFixed(positionRepeatingMaxCount)},${pos.z.toFixed(positionRepeatingMaxCount)}`;
            
                    const count = countMap.get(key) || 0;
                    countMap.set(key, count + 1);
            
                    if (count + 1 >= positionRepeatingMaxCount) {
                        return true;
                    }
                }
            
                return false;
            }
        
            function animate() {
                if (stopMovement) {
                    console.log("Unit is stuck for too long. Stopping movement.");
                    _this.animationRunning = false;
                    return; // Stop movement if the unit is stuck for too long
                }
                
                const currentPos = unit.object3D.position.clone();
                const distanceToTarget = currentPos.distanceTo(endPos);

                // --- Track position history ---
                positionHistory.push(currentPos.clone());
                if (positionHistory.length > positionHistoryMaxLength) {
                    positionHistory.shift();
                }

                // --- Check for position repetition ---
                if (positionHistory.length === positionHistoryMaxLength && positionsAreRepeating(positionHistory)) {
                    console.warn("Detected repeated positions. Stopping movement to avoid infinite loop.");
                    _this.animationRunning = false;
                    return;
                }
        
                // Check if the unit is stuck
                if (currentPos.distanceTo(previousPos) < 0.31) {
                    stuckCounter++;
                } else {
                    stuckCounter = 0; // Reset stuck counter if the unit is moving
                }
                
        
                // If stuck for a certain number of frames, apply unstuck force or stop movement
                if (stuckCounter >= stuckThreshold) {
                    const unstuckForce = applyUnstuckForce();
                    unit.object3D.position.add(unstuckForce);
                    stuckCounter = 0; // Reset after applying unstuck force

                    stuckCounterMax++;
                    
                    previousPos = unit.object3D.position.clone();
        
                    // Stop movement if stuck for too long
                    if (stuckCounterMax >= stuckThreshold) {
                        //stopMovement = true; // Set the flag to stop movement
                        //stuckCounterMax = 0;
                    }
                }

        
                if (distanceToTarget < speed) {
                    unit.setAttribute('position', target);
                    _this.animationRunning = false;
                    return;
                }
        
                const moveDir = endPos.clone().sub(currentPos).normalize();
                const seekForce = seek(currentPos);
                let avoidForce = avoid(currentPos, moveDir);
        
                // Increase avoidance force if stuck
                if (stuckCounter >= stuckThreshold) {
                    avoidForce = avoidForce.multiplyScalar(stuckAvoidanceMultiplier);
                }
        
                const finalForce = seekForce.add(avoidForce).normalize().multiplyScalar(speed);
                const nextPos = currentPos.clone().add(finalForce);
        
                unit.setAttribute('position', nextPos);
                previousPos = currentPos.clone();
        
                if (_this.stopAnimation) {
                    _this.animationRunning = false;
                    return;
                }
                requestAnimationFrame(animate);
            }
        
            requestAnimationFrame(animate);
        }
        
        function checkBoundingBoxCollision(pos1, w1, h1, d1, pos2, w2, h2, d2) {
            return (
                pos1.x + w1 / 2 > pos2.x - w2 / 2 &&
                pos1.x - w1 / 2 < pos2.x + w2 / 2 &&
                pos1.y + h1 / 2 > pos2.y - h2 / 2 &&
                pos1.y - h1 / 2 < pos2.y + h2 / 2 &&
                pos1.z + d1 / 2 > pos2.z - d2 / 2 &&
                pos1.z - d1 / 2 < pos2.z + d2 / 2
            );
        }

        /*function moveUnitTo(unit, target) {
            const speed = 0.2; // units per frame (tweak as needed)
            const startPos = unit.object3D.position.clone();
            const endPos = new THREE.Vector3(target.x, target.y, target.z);
        
            // Get unit dimensions
            const unitSize = unit.getAttribute('geometry') || {};
            const unitWidth = unitSize.width || 1;
            const unitHeight = unitSize.height || 1;
            const unitDepth = unitSize.depth || 1;
        
            function animate() {
                const currentPos = unit.object3D.position.clone();
                const direction = endPos.clone().sub(currentPos);
                const distanceToTarget = direction.length();
        
                // If the unit has reached or passed the target, stop animation
                if (distanceToTarget < speed) {
                    unit.setAttribute('position', endPos);
                    return;
                }
        
                direction.normalize().multiplyScalar(speed);
                let desiredPos = currentPos.clone().add(direction);
        
                // Avoidance logic
                const allUnits = Array.from(document.querySelectorAll('.unit')).filter((other) => other !== unit);
        
                allUnits.forEach((otherUnit) => {
                    const otherPos = otherUnit.object3D.position;
                    const otherSize = otherUnit.getAttribute('geometry') || {};
                    const otherWidth = otherSize.width || 1;
                    const otherHeight = otherSize.height || 1;
                    const otherDepth = otherSize.depth || 1;
        
                    if (checkBoundingBoxCollision(
                        desiredPos, unitWidth, unitHeight, unitDepth,
                        otherPos, otherWidth, otherHeight, otherDepth
                    )) {
                        const pushDir = desiredPos.clone().sub(otherPos).normalize();
                        const pushAmount = 0.1;
                        desiredPos.add(pushDir.multiplyScalar(pushAmount));
                    }
                });
        
                unit.setAttribute('position', desiredPos);
                requestAnimationFrame(animate);
            }
        
            requestAnimationFrame(animate);
        }
        
        // AABB collision check
        function checkBoundingBoxCollision(pos1, w1, h1, d1, pos2, w2, h2, d2) {
            return (
                pos1.x + w1 / 2 > pos2.x - w2 / 2 &&
                pos1.x - w1 / 2 < pos2.x + w2 / 2 &&
                pos1.y + h1 / 2 > pos2.y - h2 / 2 &&
                pos1.y - h1 / 2 < pos2.y + h2 / 2 &&
                pos1.z + d1 / 2 > pos2.z - d2 / 2 &&
                pos1.z - d1 / 2 < pos2.z + d2 / 2
            );
        }*/
    }


});
