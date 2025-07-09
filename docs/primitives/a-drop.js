AFRAME.registerPrimitive('a-drop', {
    defaultComponents: {
        'a-primitive': {data: `
             <a-entity drop geometry="primitive: sphere; radius: 0.5;" material="color: orange" ammo-body="type: dynamic; mass: 0.1; shape: sphere; emitCollisionEvents: true;" ammo-shape="type: box" position="0 0 0"></a-entity>
        `},
      //rotation: {x: -90, y: 0, z: 0}
    },
    mappings: {
      'p-position': 'a-primitive.position'
    }
});
