AFRAME.registerComponent('selected', {
    init() {


        console.log('Hello, you selected!');


        var isDown = false;

        var startX = 0;
        var startY = 0;

        var offsetX = 0;
        var offsetY = 0;


        document.addEventListener('mousedown', event => {
            //console.log("mousedown")
             // 0 is left, 1 is middle, 2 is right
            if (event.button !== 2) {
                return;
            }

            startX = parseInt(event.clientX - offsetX);
            startY = parseInt(event.clientY - offsetY);

            // set a flag indicating the drag has begun
            isDown = true;
        })


        document.addEventListener('mouseup', event => {
            //console.log("mouseup")

             // 0 is left, 1 is middle, 2 is right
             if (event.button !== 0) {
                return;
            }

            isDown = false;

            
            // get the current mouse position
            var mouseX = parseInt(event.clientX - 0);
            var mouseY = parseInt(event.clientY - 0);

            var width = mouseX - startX;
            var height = mouseY - startY;

   
        })


        
        
        document.addEventListener('mousemove', event => {
            //console.log("mousemove")

            if (!isDown) {
                return;
            }
        
            // get the current mouse position
            var mouseX = parseInt(event.clientX - 0);
            var mouseY = parseInt(event.clientY - 0);

            var width = mouseX - startX;
            var height = mouseY - startY;
            

        })

        
    }
});