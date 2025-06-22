AFRAME.registerPrimitive('a-barracks', {
    defaultComponents: {
        'a-primitive': {data: `
            <!-- barracks -->
            <a-entity ammo-body="type: static; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="-12 5 -8" scale="4 4 4" rotation="0 180 0">
                <a-entity gltf-model="#barracks" log-gltf-animations ammo-shape="type: hull;" position="0.35 -1.25 0.1" rotation="0 0 0" scale="1 1 1"></a-entity>
                
                <a-plane id="spawn_point" shader="flat" color="green" width="0.5" height="0.5" position="0.33 -1.3 -1.2" rotation="-90 0 0"></a-plane>
            </a-entity>
        `},
      //rotation: {x: -90, y: 0, z: 0}
    },
    mappings: {
      'p-position': 'a-primitive.position'
    }
});
