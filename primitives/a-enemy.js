AFRAME.registerPrimitive('a-enemy', {
    defaultComponents: {
        'a-primitive': {data: `
            <!-- Enemy -->
            <a-entity enemy ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true;" position="-2 5 15">
                <a-entity class="clickable target" gltf-model="#enemy" log-gltf-animations ammo-shape="type: hull;" animation-mixer="clip: CharacterArmature|Idle;" position="0 -1.15 -0.8" rotation="0 0 0" scale="1 1 1"></a-entity>
                
                <!-- Health bar group, positioned above the object -->
                <a-entity position="0 1.6 0" face-camera visible="true">
                    <!-- Background bar -->
                    <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                    <!-- Foreground bar (dynamic health) -->
                    <a-plane id="health-bar" shader="flat" color="red" width="1" height="0.1" position="0 0 0.01"></a-plane>
                </a-entity>
            </a-entity>
        `},
      //rotation: {x: -90, y: 0, z: 0}
    },
    mappings: {
      'p-position': 'a-primitive.position'
    }
});
