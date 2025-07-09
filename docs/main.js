
document.querySelector('#app').innerHTML = `
    <div id="overlay" onclick="document.getElementById('overlay').style.display = 'none';">
        <div>
            How to play<br>
            - select units by left mouse button down and movement<br>
            - right mouse button click to move selected units<br>
            - left mouse button click to unselect units<br>
            - click on the barracks and create new soldiers<br>
            - click on the garage and create new dumptrucks<br>
            - use dumptrucks to collect materials and unload them in the silo
            <br><br><br><br><br>CLICK TO START
        </div>
    </div>

    <div id="selectionBox"></div>

    <div id="gameover-win" class="popup">You WON!<br><a href="#" onclick="location.reload();">start again</a></div>
    <div id="gameover-lose" class="popup">You LOST!<br><a href="#" onclick="location.reload();">start again</a></div>

    <div id="base-garage-popup" class="popup noselect">
        <div>BASE & GARAGE</div><br>
        <div>Dumptrucks</div>
        <span>-</span> <span>1</span> <span>+</span>
        <progress value="0" max="100"></progress>
    </div>
    <div id="barracks-popup" class="popup noselect">
        <div>BARRACKS</div><br>
        <div>Soldiers</div>
        <span>-</span> <span>1</span> <span>+</span>
        <progress value="0" max="100"></progress>
    </div>

    <div id="materials">Materials: <span>1000</span></div>

    <a-scene gamemode physics="driver: ammo;"> <!-- debug: true; debugDrawMode: 1; -->

      
        <!-- External files -->
        <a-assets>
            <a-asset-item id="tree" src="./models/tree/tree.gltf"></a-asset-item>
            <a-asset-item id="soldier" src="./models/Units/Soldier/Character_Soldier.glb"></a-asset-item>
            <a-asset-item id="buldoz" src="./models/Units/Bulldozer/Bulldozer.glb"></a-asset-item>
            <a-asset-item id="dump" src="./models/Units/DumpTruck/Dump_truck.glb"></a-asset-item>
            <a-asset-item id="enemy" src="./models/Enemies/Character_Enemy.glb"></a-asset-item>
            <a-asset-item id="garage" src="./models/Buildings/Garage/Base.1.glb"></a-asset-item>
            <a-asset-item id="antena" src="./models/Buildings/Base/Radio_tower.glb"></a-asset-item>
            <a-asset-item id="silo_water" src="./models/Buildings/Silo/Water_Tank.glb"></a-asset-item>
            <a-asset-item id="silo_container" src="./models/Buildings/Silo/Container_Small.glb"></a-asset-item>
            <a-asset-item id="barracks" src="./models/Buildings/Barracks/Large_Building.glb"></a-asset-item>
            <a-asset-item id="terrain" src="./models/t.glb"></a-asset-item>
            <img src="./models/grass.jpg" id="grass">
            <img src="./models/night-sky.jpg" id="sky">
        </a-assets>


        <!-- camera -->
        <a-entity cam camera wasd-controls look-controls="enabled:false; reverseMouseDrag:true" position="0 15 15" rotation="-45 0 0" ></a-entity>
        <!-- mouse -->
        <a-entity cursor="rayOrigin:mouse" raycaster="objects: .clickable;"></a-entity>
        


        <!-- Lights -->
        <a-entity light="type: ambient; color: #FFF; intensity: 0.01;"></a-entity>
        <a-entity light="type: directional; color: #FFF; intensity: 0.2; castShadow: true; shadow-camera-automatic: [shadow]; shadowMapWidth: 1024; shadowMapHeight: 1024;" position="-1 1 0"></a-entity>
  

        <!-- Environment -->
        <!--  sky    --> <a-sky src="#sky"></a-sky>
        <!--  tree   --> <a-entity ammo-body="type: static;" ammo-shape="type: box" gltf-model="#tree" position="2.9 -0.1 -13" scale="0.2 0.2 0.2"></a-entity> 
        <!-- ground  --> <a-entity class="clickable" gltf-model="#terrain" id=terrain2 ammo-body="type: static;" ammo-shape="type: mesh" position="0 -2.1 -10"></a-entity>
        <!-- ground2 --> <a-box class="clickable" id="terrain3" ammo-body="type: static;" ammo-shape="type: box" position="0 -1.5 0" width="130" height="1" depth="130" material="src: #grass; repeat: 5 5;" shadow="receive: true"></a-box> 
        <!-- <a-box color="red" position="0 0 0" depth="1" height="2" width="1"></a-box> -->
        <a-box color="red" position="-65 0 0" depth="130" height="2" width="1"></a-box>
        <a-box color="red" position="65 0 0" depth="130" height="2" width="1"></a-box>
        <a-box color="red" position="0 0 -65" depth="1" height="2" width="130"></a-box>
        <a-box color="red" position="0 0 65" depth="1" height="2" width="130"></a-box>

        
        <a-character p-position="-2 0 -3"></a-character>
        <a-character p-position="-5 0 -3"></a-character>

        <a-dumptruck p-position="-10 0 -3"></a-dumptruck>
        <a-bulldozer p-position="-7 0 -15"></a-bulldozer>


        <a-barracks p-position="-25 0 -15"></a-barracks>
        <a-base-garage p-position="-12 0 -18"></a-base-garage>
        <a-silo p-position="-19 0 -15"></a-silo>

        <a-drop drop="size: 50" p-position="0 0 0"></a-drop>
        <a-drop p-position="2 0 -3"></a-drop>
        <a-drop p-position="4 0 -2"></a-drop>
        <a-drop p-position="4 0 -2"></a-drop>
        <a-drop p-position="4 0 -2"></a-drop>
        <a-drop p-position="4 0 -2"></a-drop>
        <a-drop p-position="4 0 -2"></a-drop>
        <a-drop p-position="4 0 -2"></a-drop>
    


        <a-enemy p-position="-2 0 15"></a-enemy>
        <a-enemy p-position="-2 0 15"></a-enemy>
        <a-enemy p-position="-2 0 15"></a-enemy>
        <a-enemy p-position="-2 0 15"></a-enemy>


        <a-enemy p-position="-30 0 15"></a-enemy>
        <a-enemy p-position="-30 0 15"></a-enemy>
        <a-enemy p-position="-30 0 15"></a-enemy>
        <a-enemy p-position="-30 0 15"></a-enemy>


    </a-scene>
    
`;
