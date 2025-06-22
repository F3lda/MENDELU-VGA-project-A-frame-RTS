AFRAME.registerPrimitive('a-base-garage', {
    defaultComponents: {
        'a-primitive': {data: `
            <!-- base garage -->
            <a-entity scale="3.5 3.5 3.5">
                <a-entity ammo-body="type: static; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="0 0 0" scale="3 3 3" rotation="0 180 0">
                    <a-entity gltf-model="#garage" log-gltf-animations ammo-shape="type: hull;" position="0.01 -0.05 0.04" rotation="0 0 0" scale="1 1 1"></a-entity>
                </a-entity>
                <a-entity ammo-body="type: static; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="1.5 0 0" scale="0.5 0.5 0.5" rotation="0 180 0">
                    <a-entity gltf-model="#antena" log-gltf-animations ammo-shape="type: hull;" position="0 -1.7 0" rotation="0 0 0" scale="0.1 0.1 0.1"></a-entity>
                </a-entity>

                <a-plane id="spawn_point" shader="flat" color="green" width="0.5" height="0.5" position="-0.05 -0.75 1" rotation="-90 0 0"></a-plane>
            </a-entity>
        `},
      //rotation: {x: -90, y: 0, z: 0}
    },
    mappings: {
      'p-position': 'a-primitive.position'
    }
});
