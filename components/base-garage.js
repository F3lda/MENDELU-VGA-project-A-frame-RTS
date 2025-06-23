AFRAME.registerComponent('base-garage', {
    schema: {
    },
    init: function () {

        var _this = this;
        this.dumptrucksToCreate = 0;
        this.dumptruckCost = 100;

        this.progress = 0;
        this.progressInterval = null;






        console.log("garage here!");

        var objectClicked = false;
        var mouseButton;

        document.addEventListener('mousedown', (event) => {
            objectClicked = false;
            mouseButton = event.button;
        });        
        
        document.addEventListener('mouseup', (event) => {
            console.log("mouseup GARAGE");
            if (objectClicked) { // show popup
                preparePopUpUI();
                document.getElementById("base-garage-popup").style.display = "block";
            } else if (event.target.closest("#base-garage-popup") == null) { // close only when clicked outside
                document.getElementById("base-garage-popup").style.display = "none";
            }
            console.log(event.target.closest("#base-garage-popup") == null);
        });

        this.el.addEventListener('click', (e) => {

            // 0 is left, 1 is middle, 2 is right
            if (mouseButton !== 0) return;
            
            console.log("onclick GARAGE");

            objectClicked = true;

        });















        function preparePopUpUI() {
            document.querySelector("#base-garage-popup > span:nth-of-type(2)").innerHTML = _this.dumptrucksToCreate;
            document.querySelector("#base-garage-popup > progress").value = _this.progress;
            document.querySelector("#materials > span").innerHTML = window.materials;
        }

        document.querySelector("#base-garage-popup > span:nth-of-type(1)").addEventListener('click', (e) => {
            // 0 is left, 1 is middle, 2 is right
            if (mouseButton === 0 && _this.dumptrucksToCreate > 0) {
                _this.dumptrucksToCreate--;
            } else if (mouseButton === 0 && _this.dumptrucksToCreate == 0 && _this.progressInterval != null) {
                clearInterval(_this.progressInterval);
                _this.progressInterval = null;
                _this.progress = 0;
                window.materials += _this.dumptruckCost;
            }
            preparePopUpUI();
        });

        document.querySelector("#base-garage-popup > span:last-of-type").addEventListener('click', (e) => {
            // 0 is left, 1 is middle, 2 is right
            if (mouseButton === 0) {
                _this.dumptrucksToCreate++;
            }
            preparePopUpUI();

            createNewDumptruck();
        });



        function createNewDumptruck() {
            // start creating new dumptruck
            if (_this.progressInterval == null && window.materials >= _this.dumptruckCost && _this.dumptrucksToCreate > 0) {
                window.materials -= _this.dumptruckCost;
                _this.dumptrucksToCreate--;
                _this.progress = 0;
                preparePopUpUI();
                _this.progressInterval = setInterval(function () {
                    _this.progress += 10;
                    preparePopUpUI();
                    // spawn new dumptruck
                    if (_this.progress >= 100) {
                        clearInterval(_this.progressInterval);
                        _this.progressInterval = null;
                        _this.progress = 0;
                        preparePopUpUI();

                        
                        var worldpos = new THREE.Vector3();
                        _this.el.querySelector("#spawn_point").getObject3D("mesh").getWorldPosition(worldpos);

                        const dumptruck = document.createElement("a-dumptruck");
                        dumptruck.setAttribute('position', worldpos);
                        
                        const newDumptruck = _this.el.sceneEl.appendChild(dumptruck);


                        // move dumptruck away from garage
                        setTimeout(function () {
                            newDumptruck.components["character"].moveTo(newDumptruck, { x: worldpos.x, y: worldpos.y, z: worldpos.z+5 }, worldpos);
                        }, 100);


                        createNewDumptruck(); // next dumptruck
                    }
                }, 1000);
            } else if (_this.progressInterval == null && window.materials < _this.dumptruckCost && _this.dumptrucksToCreate > 0) {
                setTimeout(function () {createNewDumptruck();}, 3000);
            }
        }





    }
});
