AFRAME.registerComponent('a-primitive', {
    schema:{
        position: {type: 'vec3', default: '0 0 0'},
        data: {type: 'string', default: ''}
    },
    init: function() {
        function createElementFromHTML(htmlString) {
            var div = document.createElement('div');
            div.innerHTML = htmlString.trim();
            return div.firstElementChild; // Change this to div.children to support multiple top-level nodes.
        }

        let element = createElementFromHTML(this.data.data);
console.log(element)
        this.el.innerHTML = element.innerHTML;
        if (element.hasAttributes()) {
            for (const attr of element.attributes) {
                this.el.setAttribute(attr.name, attr.value);
            }
        }
        this.el.setAttribute('position', this.data.position);
    }
});
