/* Custom component to face the camera */
AFRAME.registerComponent('face-camera', {
    tick: function () {
        const camera = this.el.sceneEl.camera;
        if (!camera) return;

        const obj = this.el.object3D;

        const camPos = new THREE.Vector3();
        camera.getWorldPosition(camPos);

        const objPos = new THREE.Vector3();
        obj.getWorldPosition(objPos);

        objPos.y = camPos.y;
        objPos.z = camPos.z;

        obj.lookAt(objPos); // face camera only verticaly
        //obj.lookAt(camPos);
    }
});
