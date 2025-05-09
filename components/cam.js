AFRAME.registerComponent('cam', {
    init() {


        //https://stackoverflow.com/questions/48434953/aframe-screen-to-world-position
        document.addEventListener('click', (e) => {
            console.log(e.detail.intersectedEl);

            /*let mouse = new THREE.Vector2()
            let camera = AFRAME.scenes[0].camera
            let rect = document.querySelector('body').getBoundingClientRect()
            mouse.x = ( (e.clientX - rect.left) / rect.width ) * 2 - 1
            mouse.y = - ( (e.clientY - rect.top) / rect.height ) * 2 + 1
            let vector = new THREE.Vector3( mouse.x, mouse.y, -1 ).unproject( camera )
            console.log(vector)*/


            /*// grab the reference to the underlaying object
            const mesh = this.el.getObject3D("mesh");
            // or const mesh = this.el.object3D; 

            // create a vector where the position will be copied to
            const worldpos = new THREE.Vector3();

            // get the world position - it's in the worldpos vector
            mesh.getWorldPosition(worldpos);
            console.log(worldpos)

            console.log(this.el.getObject3D('mesh').geometry.vertices)*/

            /*if (this.el.sceneEl.camera) {
                console.log("cam");
                var cam = this.el.sceneEl.camera
                var frustum = new THREE.Frustum();
                frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse));  
          */
                //console.log(this.el.sceneEl.object3D.children)
                // Your 3d point to check
                //var pos = new THREE.Vector3(x, y, z);
                /*if (frustum.intersectsObject(this.el.sceneEl.getObject3D('mesh'))) {
                  // Do something with the position...
                  alert("JOP");
                }*/
             //}
          })



        console.log('Hello, you cam!');


        window.addEventListener('wheel', event => {

            console.log("scroll");

            const pos = this.el.getAttribute('position')
            // grab the camera
            var player = document.querySelector("a-camera")
            // create a direction vector
            var direction = new THREE.Vector3();

            if (event.deltaY < 0) {
                // get the cameras world direction
                this.el.sceneEl.camera.getWorldDirection(direction);
                // multiply the direction by a "speed" factor
                direction.multiplyScalar(0.5)
                // get the current position
                //var pos = player.getAttribute("position")
                // add the direction vector
                pos.add(direction)
                // set the new position
                //player.setAttribute("position", pos);
                // !!! NOTE - it would be more efficient to do the
                // position change on the players THREE.Object:
                // `player.object3D.position.add(direction)`
                // but it would break "getAttribute("position")
            }


            
            if (event.deltaY > 0) {
                // get the cameras world direction
                this.el.sceneEl.camera.getWorldDirection(direction);
                // multiply the direction by a "speed" factor
                direction.multiplyScalar(-0.5)
                // get the current position
                //var pos = player.getAttribute("position")
                // add the direction vector
                pos.add(direction)
                // set the new position
                //player.setAttribute("position", pos);
                // !!! NOTE - it would be more efficient to do the
                // position change on the players THREE.Object:
                // `player.object3D.position.add(direction)`
                // but it would break "getAttribute("position")
            }
        })





        const selectionBox = document.getElementById('selectionBox');
        const sceneEl = document.querySelector('a-scene');
        const units = Array.from(document.querySelectorAll('.unit'));

        let startX, startY, endX, endY;
        let isSelecting = false;
            let selectedUnits = [];

        document.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return;
            isSelecting = true;
            startX = e.clientX;
            startY = e.clientY;
            selectionBox.style.left = startX + 'px';
            selectionBox.style.top = startY + 'px';
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
            selectionBox.style.display = 'block';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isSelecting) return;
            endX = e.clientX;
            endY = e.clientY;

            const left = Math.min(startX, endX);
            const top = Math.min(startY, endY);
            const width = Math.abs(startX - endX);
            const height = Math.abs(startY - endY);

            selectionBox.style.left = left + 'px';
            selectionBox.style.top = top + 'px';
            selectionBox.style.width = width + 'px';
            selectionBox.style.height = height + 'px';
        });

        document.addEventListener('mouseup', () => {
            if (!isSelecting) return;
            isSelecting = false;

            const rect = selectionBox.getBoundingClientRect();
            selectedUnits = [];
            
            selectionBox.style.display = 'none';

            units.forEach((unit) => {
            const worldPos = unit.object3D.getWorldPosition(new THREE.Vector3());
            const screenPos = worldToScreen(worldPos, sceneEl.camera);			

            if (
                screenPos.x >= rect.left &&
                screenPos.x <= rect.right &&
                screenPos.y >= rect.top &&
                screenPos.y <= rect.bottom
            ) {
                selectedUnits.push(unit);
                unit.setAttribute('color', 'yellow');
            } else {
                unit.setAttribute('color', 'red');
            }
            });

            console.log('Selected units:', selectedUnits);
        });

        function worldToScreen(position, camera) {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const vector = new THREE.Vector3(position.x, position.y, position.z);
            vector.project(camera);

            return {
            x: ((vector.x + 1) / 2) * width,
            y: ((-vector.y + 1) / 2) * height,
            };
        }








        /* ************ units movement - test ********** */
        var mouseButton;
        document.addEventListener('mousedown', (event) => {
            mouseButton = event.button;
        });
        
        sceneEl.addEventListener('click', (e) => {
            // Skip if click was part of a selection box drag
            if (isSelecting) return;
            // 0 is left, 1 is middle, 2 is right
            console.log(mouseButton);
            if (mouseButton !== 2) return;
            
            
            // Only act if plane was clicked
            if (!e.target.classList.contains('clickable')) return;
            
            // Get intersection point
            const intersection = e.detail.intersection;
            if (!intersection) return;
            
            const dest = intersection.point;
            
            selectedUnits.forEach((unit, i) => {
                const offsetX = (i % 3) * 1.5;
                const offsetZ = Math.floor(i / 3) * 1.5;
                const targetX = dest.x + offsetX;
                const targetZ = dest.z + offsetZ;
            
                unit.components["unit"].moveTo(unit, { x: targetX, y: 0.5, z: targetZ });
                //moveUnitTo(unit, { x: targetX, y: 0.5, z: targetZ });
            });
        });
        
        
    }
});
