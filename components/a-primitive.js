AFRAME.registerComponent('a-primitive', {
    schema:{
        position: {type: 'vec3', default: '0 0 0'},
        data: {type: 'string', default: ''},
        origin: {type: 'vec3', default: '0 0 0'}
    },
    init: function() {
        function createElementFromHTML(htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();
            return div.firstElementChild; // Change this to div.children to support multiple top-level nodes.
        }

        let element = createElementFromHTML(this.data.data);

        this.el.innerHTML = element.innerHTML;
        if (element.hasAttributes()) {
            for (const attr of element.attributes) {
                this.el.setAttribute(attr.name, attr.value);
            }
        }
        
        var originPosition = new THREE.Vector3();
        originPosition = this.data.position;
        originPosition.y += this.data.origin.y;
        this.el.setAttribute('position', originPosition);
        //this.el.setAttribute('position', this.data.position);
    }
});
