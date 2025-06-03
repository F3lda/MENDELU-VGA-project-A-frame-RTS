AFRAME.registerComponent('character', {
    schema: {
        //destPoint: {default: null}
        health: {type: 'int', default: 100},
        damage: {type: 'int', default: 30},
    },
    init() {
    }
});
