AFRAME.registerComponent('pokus', {
    schema: {
        txt: {
            type: 'string',
            default: ''
        }
    },
    init() {
        var data = this.data;

        var mouseButton = 0;

        console.log('Hello, you pokus!');
        this.el.addEventListener('click', (event) => {
            // 0 is left, 1 is middle, 2 is right
            if (mouseButton === 2) {
                alert('Pokus - pravá: '+data.txt)
            }
            /*if (mouseButton === 0) {
                alert('Pokus - levá: '+data.txt)
            }*/
            
        })
        document.addEventListener('mousedown', (event) => {
            // 0 is left, 1 is middle, 2 is right
            mouseButton = event.button;
        })
    }
})