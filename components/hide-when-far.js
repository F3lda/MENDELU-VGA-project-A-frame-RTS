AFRAME.registerComponent('hide-when-far', {
    schema: {
      distance: { type: 'number', default: 5 }
    },

    tick: function () {
      const myPos = this.el.object3D.position;
      let anyClose = false;

      document.querySelectorAll('[character]').forEach(target => {
        if (!target.object3D) return;
        const targetPos = target.object3D.position;
        const dist = myPos.distanceTo(targetPos);
        if (dist <= this.data.distance) {
          anyClose = true;
        }
      });

      this.el.setAttribute('visible', anyClose);
    }
});
