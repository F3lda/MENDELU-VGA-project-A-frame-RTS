AFRAME.registerComponent('barracks', {
    schema: {
    },
    init: function () {

        var _this = this;
        this.soldiersToCreate = 0;
        this.soldierCost = 100;

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
                document.getElementById("barracks-popup").style.display = "block";
            } else if (event.target.closest("#barracks-popup") == null) { // close only when clicked outside
                document.getElementById("barracks-popup").style.display = "none";
            }
            console.log(event.target.closest("#barracks-popup") == null);
        });

        this.el.addEventListener('click', (e) => {

            // 0 is left, 1 is middle, 2 is right
            if (mouseButton !== 0) return;
            
            console.log("onclick GARAGE");

            objectClicked = true;

        });








        function preparePopUpUI() {
            document.querySelector("#barracks-popup > span:nth-of-type(2)").innerHTML = _this.soldiersToCreate;
            document.querySelector("#barracks-popup > progress").value = _this.progress;
            document.querySelector("#materials > span").innerHTML = window.materials;
        }

        document.querySelector("#barracks-popup > span:nth-of-type(1)").addEventListener('click', (e) => {
            // 0 is left, 1 is middle, 2 is right
            if (mouseButton === 0 && _this.soldiersToCreate > 0) {
                _this.soldiersToCreate--;
            } else if (mouseButton === 0 && _this.soldiersToCreate == 0 && _this.progressInterval != null) {
                clearInterval(_this.progressInterval);
                _this.progressInterval = null;
                _this.progress = 0;
                window.materials += _this.soldierCost;
            }
            preparePopUpUI();
        });

        document.querySelector("#barracks-popup > span:last-of-type").addEventListener('click', (e) => {
            // 0 is left, 1 is middle, 2 is right
            if (mouseButton === 0) {
                _this.soldiersToCreate++;
            }
            preparePopUpUI();

            createNewSoldier();
        });



        function createNewSoldier() {
            // start creating new soldier
            if (_this.progressInterval == null && window.materials >= _this.soldierCost && _this.soldiersToCreate > 0) {
                window.materials -= _this.soldierCost;
                _this.soldiersToCreate--;
                _this.progress = 0;
                preparePopUpUI();
                _this.progressInterval = setInterval(function () {
                    _this.progress += 10;
                    preparePopUpUI();
                    // spawn new soldier
                    if (_this.progress >= 100) {
                        clearInterval(_this.progressInterval);
                        _this.progressInterval = null;
                        _this.progress = 0;
                        preparePopUpUI();

                        
                        var worldpos = new THREE.Vector3();
                        _this.el.querySelector("#spawn_point").getObject3D("mesh").getWorldPosition(worldpos);

                        const soldier = document.createElement("a-character");
                        soldier.setAttribute('position', worldpos);
                        
                        const newSoldier = _this.el.sceneEl.appendChild(soldier);

                        // move soldier away from barracks
                        setTimeout(function () {
                            newSoldier.components["character"].moveTo(newSoldier, { x: worldpos.x, y: worldpos.y, z: worldpos.z+3 }, worldpos);
                        }, 100);


                        createNewSoldier(); // next soldier
                    }
                }, 1000);
            } else if (_this.progressInterval == null && window.materials < _this.dumptruckCost && _this.dumptrucksToCreate > 0) {
                setTimeout(function () {createNewDumptruck();}, 3000);
            }
        }

    }
});
