AFRAME.registerPrimitive('a-dumptruck', {
    defaultComponents: {
        'a-primitive': {data: `
            <!-- Dumptruck -->
            <a-entity character dumptruck class="selectable" ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="-10 5 -3" scale="0.2 0.2 0.2" rotation="0 0 0">
                <a-entity class="dumptrucks" gltf-model="#dump" log-gltf-animations ammo-shape="type: hull;" position="0 -2 0" rotation="0 0 0" scale="1 1 1">
                    <a-plane color="red" width="3" height="3" position="0 3 0" rotation="-90 0 0"></a-plane>
                </a-entity>
                
                <!-- Health bar group, positioned above the object -->
                <a-entity position="0 4.6 0" face-camera scale="5 5 5" visible="false">
                    <!-- Background bar -->
                    <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                    <!-- Foreground bar (dynamic health) -->
                    <a-plane id="health-bar" shader="flat" color="green" width="1" height="0.1" position="0 0 0.01"></a-plane>
                </a-entity>            
                <!-- Dump bar group, positioned above the object -->
                <a-entity position="0 6 0" face-camera scale="5 5 5" visible="false">
                    <!-- Background bar -->
                    <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                    <!-- Foreground bar (dynamic health) -->
                    <a-plane id="dump-bar" shader="flat" color="orange" width="1" height="0.1" position="0 0 0.01" scale="0 1 1"></a-plane>
                </a-entity>
            </a-entity>
        `},
      //rotation: {x: -90, y: 0, z: 0}
    },
    mappings: {
      'p-position': 'a-primitive.position'
    }
});
