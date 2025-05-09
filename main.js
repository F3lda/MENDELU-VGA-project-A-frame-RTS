import './style.css'
import 'aframe'
import 'aframe-physics-system'
import 'aframe-extras'
import './components/character'
import './components/obstacle'
import './components/cam'
import './components/pokus'
import './components/selected'
import './components/cursor-listener'
import './components/unit'

document.querySelector('#app').innerHTML = `
    <div id="selectionBox"></div>

    <a-scene cursor="rayOrigin: mouse" raycaster="objects: .clickable">
      <a-plane
        class="clickable"
        position="0 0 0"
        rotation="-90 0 0"
        width="30"
        height="30"
        color="#7BC8A4"
      ></a-plane>

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

      

      <a-entity class="obstacle" geometry="primitive: box; width: 5; height: 2; depth: 2" position="3 0.5 -9"></a-entity>
      <a-entity class="obstacle" geometry="primitive: box; width: 5; height: 2; depth: 2" position="3 0.5 -3"></a-entity>

      <a-entity light="type: ambient; color: #fff"></a-entity>
      <a-entity
        cam
        camera
        wasd-controls
        look-controls="enabled:false; reverseMouseDrag:true"
        position="0 15 15"
        rotation="-45 0 0"
        look-controls="enabled: false"
      ></a-entity>
    </a-scene>
    
`;

/*<a-box class="clickable obstacle" color="red" position="3 0.5 -9" depth="1" height="1" width="5"></a-box>
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
