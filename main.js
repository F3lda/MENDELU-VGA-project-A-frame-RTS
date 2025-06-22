import './style.css'
/*import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'*/
import './components/enemy'
import './primitives/a-character'
import './primitives/a-enemy'
import './primitives/a-dumptruck'
import './primitives/a-bulldozer'
import './components/a-primitive'
import './components/dumptruck'
import './components/character'
import './components/bullet'
//import './components/old/obstacle'
import './components/cam'
import './components/drop'
import './components/face-camera'
//import './components/old/pokus'
//import './components/old/selected'
//import './components/old/cursor-listener'
//import './components/collider-check'
//import './components/old/unit'
import './components/log-gltf-animations'
import './shaders/glowing'


document.querySelector('#app').innerHTML = `
    <div id="selectionBox"></div>

    <a-scene physics="driver: ammo; debug: true; debugDrawMode: 1;">

      
        <!-- External files -->
        <a-assets>
            <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
            <a-asset-item id="soldier" src="/models/Units/Soldier/Character_Soldier.glb"></a-asset-item>
            <a-asset-item id="buldoz" src="/models/Units/Bulldozer/Bulldozer.glb"></a-asset-item>
            <a-asset-item id="dump" src="/models/Units/DumpTruck/Dump_truck.glb"></a-asset-item>
            <a-asset-item id="enemy" src="/models/Enemies/Character_Enemy.glb"></a-asset-item>
            <a-asset-item id="terrain" src="/models/t.glb"></a-asset-item>
            <img src="/models/grass.jpg" id="grass">
            <img src="/models/asteroid.jpg" id="ball">
            <img src="/models/night-sky.jpg" id="sky">
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
        <!--  tree   --> <a-entity ammo-body="type: static;" ammo-shape="type: box" gltf-model="#tree" position="2.9 -1.9 -7" scale="0.2 0.2 0.2"></a-entity> 
        <!-- ground  --> <a-entity class="clickable" gltf-model="#terrain" id=terrain2 ammo-body="type: static;" ammo-shape="type: mesh" position="0 -4 -4"></a-entity>
        <!-- ground2 --> <a-box class="clickable" id="terrain3" ammo-body="type: static;" ammo-shape="type: mesh" position="0 -4 -4" width="130" height="1" depth="130" material="src: #grass; repeat: 5 5;" shadow="receive: true"></a-box> 
        <a-box color="red" position="0 0 0" depth="1" height="2" width="1"></a-box>


        
        <a-character p-position="-2 5 -3"></a-character>
        <a-character p-position="-5 5 -3"></a-character>
        <a-enemy p-position="-2 5 15"></a-enemy>

        <a-dumptruck p-position="-10 5 -3"></a-dumptruck>
        <a-bulldozer p-position="-12 5 -8"></a-bulldozer>



        <!-- Obstacles -->
        <a-sphere drop ammo-body="type: dynamic" ammo-shape="type: box" obstacle="strength: 100"  position="2 5 -3" radius="0.5" color="orange"></a-sphere>
        <a-sphere drop ammo-body="type: dynamic" ammo-shape="type: box" obstacle="strength: 100"  position="4 5 -2" radius="0.5" color="orange"></a-sphere>
    




      










      <!-- Obstacles
      <a-entity static-body obstacle class="obstacle" geometry="primitive: box; width: 5; height: 2; depth: 2" position="3 0.5 -9"></a-entity>
      <a-entity static-body obstacle class="obstacle" geometry="primitive: box; width: 5; height: 2; depth: 2" position="3 0.5 -3"></a-entity>

  
      <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.3;" position="2 1 -3" radius="0.5" color="orange" shadow="cast: true"></a-sphere>
      <a-sphere obstacle="strength: 9999" position="2 1 -1" radius="0.5" material="shader: glowing; transparent: true; color1: red; color2: blue; uMap: #ball;"></a-sphere>
      -->
   

    </a-scene>
    
`;

/*

      <!-- More Units -->
      <a-box unit class="unit clickable obstacle" color="red" position="-4 0.5 -5" depth="1" height="1" width="1"></a-box>
      <a-box unit class="unit clickable obstacle" color="red" position="-2 0.5 -5" depth="1" height="1" width="1"></a-box>
      <a-box unit class="unit clickable obstacle" color="red" position="0 0.5 -5" depth="1" height="1" width="1"></a-box>
      <a-box unit class="unit clickable obstacle" color="red" position="2 0.5 -5" depth="1" height="1" width="1"></a-box>
      <a-box unit class="unit clickable obstacle" color="red" position="4 0.5 -5" depth="1" height="1" width="1"></a-box>

      <!-- Add more units in different positions -->
      <a-box unit class="unit clickable obstacle" color="red" position="-5 0.5 -7" depth="1" height="1" width="1"></a-box>
      <a-box unit class="unit clickable obstacle" color="red" position="-3 0.5 -7" depth="1" height="1" width="1"></a-box>
      <a-box unit class="unit clickable obstacle" color="red" position="-1 0.5 -7" depth="1" height="1" width="1"></a-box>
      <a-box unit class="unit clickable obstacle" color="red" position="1 0.5 -7" depth="1" height="1" width="1"></a-box>
      <a-box unit class="unit clickable obstacle" color="red" position="3 0.5 -7" depth="1" height="1" width="1"></a-box>



<a-entity light="type: ambient; color: #fff"></a-entity>




<a-box class="clickable obstacle" color="red" position="3 0.5 -9" depth="1" height="1" width="5"></a-box>
      <a-box class="clickable obstacle" color="red" position="3 0.5 -3" depth="1" height="1" width="5"></a-box>
<div id="game-over">You lost!</div>
    <div id="selection" style="border-width:3px; border-color:green; border-style: solid; display:none;">Selection</div>
    <a-scene>
        <a-assets>
            <a-asset-item id="box" src="models/chest.glb"></a-asset-item>
        </a-assets>

        <!-- Camera                -->
        <a-entity cam camera look-controls="reverseMouseDrag:true" wasd-controls position="0 2 4" rotation="-45 0 0">
        
        </a-entity>

        <!-- Character -->
        <a-entity  class="cursor-listener" pokus="txt:box"
            gltf-model="#box" 
            dynamic-body
            animation-mixer="clip: open; loop: pingpong;" 
            position="0 7 -4" 
            scale="0.2 0.2 0.2"
        ></a-entity>
               
        <!-- Floor -->
        <a-box class="cursor-listener" selected static-body pokus="txt:zem" position="0 0 -4" rotation="-90 0 0" width="7" height="4" depth="0.5" color="#7BC8A4"></a-box>

        <!-- mouse -->
        <a-entity cursor="rayOrigin:mouse" raycaster="objects: .cursor-listener; showLine:true; lineColor:red;"></a-entity>


    </a-scene>
     */
