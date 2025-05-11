import './style.css'
import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'
import './components/character'
import './components/obstacle'
import './components/cam'
import './components/pokus'
import './components/selected'
import './components/cursor-listener'
//import './components/collider-check'
import './components/unit'
import './components/log-gltf-animations'
import './shaders/glowing'
// cursor="rayOrigin: mouse" raycaster="objects: .clickable"
document.querySelector('#app').innerHTML = `
    <div id="selectionBox"></div>

    <a-scene>

    
        <!--  ground --> <a-box class="clickable obstacle" nav-mesh  id="navmesh" static-body="friction: 0;" position="0 0 -2" width="130" height="0.2" depth="130" material="src: #grass; repeat: 5 5;" shadow="receive: true"></a-box> 
      
      <!-- External files -->
      <a-assets>
          <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
          <a-asset-item id="eva" src="/models/eva-animated-complete.glb"></a-asset-item>
          <img src="/models/grass.jpg" id="grass">
          <img src="/models/asteroid.jpg" id="ball">
          <img src="/models/night-sky.jpg" id="sky">
      </a-assets>


      
      <!-- Lights -->
      <a-entity light="type: ambient; color: #FFF; intensity: 0.01;"></a-entity>
      <a-entity light="type: directional; color: #FFF; intensity: 0.2; castShadow: true; shadow-camera-automatic: [shadow]; shadowMapWidth: 1024; shadowMapHeight: 1024;" position="-1 1 0"></a-entity>



      <!-- Character -->
      <a-entity character class="obstacle unit" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 0.4 -3">
          <a-entity gltf-model="#eva" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1" shadow="cast: true">
              <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7; castShadow: true;" position="0 1 0" rotation="0 180 0"></a-entity>
          </a-entity>
          <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
      </a-entity>

      <a-entity character class="obstacle unit" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 0.4 -3">
      <a-entity gltf-model="#eva" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1" shadow="cast: true">
          <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7; castShadow: true;" position="0 1 0" rotation="0 180 0"></a-entity>
      </a-entity>
      <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
  </a-entity>

  <a-entity character class="obstacle unit" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 0.4 -3">
  <a-entity gltf-model="#eva" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1" shadow="cast: true">
      <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7; castShadow: true;" position="0 1 0" rotation="0 180 0"></a-entity>
  </a-entity>
  <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
</a-entity>

      <!-- Environment -->
      <!--  sky    --> <a-sky src="#sky"></a-sky>
      <!--  tree   --> <a-entity static-body obstacle class="obstacle" gltf-model="#tree" position="2 0 -6" scale="0.2 0.2 0.2" shadow="cast: true;"></a-entity> 
  
      

      <a-entity static-body obstacle class="obstacle" geometry="primitive: box; width: 5; height: 2; depth: 2" position="3 0.5 -9"></a-entity>
      <a-entity static-body obstacle class="obstacle" geometry="primitive: box; width: 5; height: 2; depth: 2" position="3 0.5 -3"></a-entity>

      <!-- Obstacles -->
      <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.3;" position="2 1 -3" radius="0.5" color="orange" shadow="cast: true"></a-sphere>
      <a-sphere obstacle="strength: 9999" position="2 1 -1" radius="0.5" material="shader: glowing; transparent: true; color1: red; color2: blue; uMap: #ball;"></a-sphere>
      
      
      <a-entity
        cam
        camera
        wasd-controls
        look-controls="enabled:false; reverseMouseDrag:true"
        position="0 15 15"
        rotation="-45 0 0"
      ></a-entity>
      <!-- mouse -->
      <a-entity cursor="rayOrigin:mouse" raycaster="objects: .clickable;"></a-entity>


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
