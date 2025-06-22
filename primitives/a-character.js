AFRAME.registerPrimitive('a-character', {
    defaultComponents: {
        'a-primitive': {data: `
            <!-- Character -->
            <a-entity character class="selectable" ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true;" position="-2 5 -3">
                <a-entity class="target" gltf-model="#soldier" log-gltf-animations ammo-shape="type: hull;" animation-mixer="clip: CharacterArmature|Idle;" position="0 -1.1 -1" rotation="0 0 0" scale="1 1 1"></a-entity>
                
                <!-- Health bar group, positioned above the object -->
                <a-entity position="0 1.6 0" face-camera visible="false">
                    <!-- Background bar -->
                    <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                    <!-- Foreground bar (dynamic health) -->
                    <a-plane id="health-bar" shader="flat" color="green" width="1" height="0.1" position="0 0 0.01"></a-plane>
                </a-entity>
            </a-entity>
        `},
      //rotation: {x: -90, y: 0, z: 0}
    },
    mappings: {
      'p-position': 'a-primitive.position'
    }
});
