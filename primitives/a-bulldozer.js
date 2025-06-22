AFRAME.registerPrimitive('a-bulldozer', {
    defaultComponents: {
        'a-primitive': {data: `
            <!-- bulldozer -->
            <a-entity character class="selectable" ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="-12 5 -8" scale="0.1 0.1 0.1" rotation="0 0 0">
                <a-entity gltf-model="#buldoz" log-gltf-animations ammo-shape="type: hull;" position="0 -5 0" rotation="0 0 0" scale="1 1 1"></a-entity>
                
                <!-- Health bar group, positioned above the object -->
                <a-entity position="0 6.6 0" face-camera scale="10 10 10" visible="false">
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
