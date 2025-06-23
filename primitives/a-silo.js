AFRAME.registerPrimitive('a-silo', {
    defaultComponents: {
        'a-primitive': {origin: '0 1.5 0', data: `
            <!-- silo -->
            <a-entity scale="1.3 1.3 1.3">
                <a-entity ammo-body="type: static; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="0 1.7 0" scale="1 1 1" rotation="0 0 0">
                    <a-entity gltf-model="#silo_water" log-gltf-animations ammo-shape="type: hull;" position="0 -1.75 -0.3" rotation="0 0 0" scale="1 1 1"></a-entity>
                </a-entity>
                <a-entity ammo-body="type: static; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="0 -1 -0.3" scale="0.9 0.9 0.9" rotation="0 180 0">
                    <a-entity gltf-model="#silo_container" log-gltf-animations ammo-shape="type: hull;" position="0 -1.1 0" rotation="0 0 0" scale="1 1 1"></a-entity>
                    <a-entity silo position="0 0 0" raycaster="objects: .dumptrucks; showLine: true; far: 2;"></a-entity>
                </a-entity>
            </a-entity>
        `},
      //rotation: {x: -90, y: 0, z: 0}
    },
    mappings: {
      'p-position': 'a-primitive.position'
    }
});
