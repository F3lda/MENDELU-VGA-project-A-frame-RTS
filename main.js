import './style.css'
/*import 'aframe'
import 'aframe-extras'
import 'aframe-physics-system'*/
import './components/enemy'
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
// cursor="rayOrigin: mouse" raycaster="objects: .clickable"


  AFRAME.registerComponent("table", {
    init: function() {
      let desk = document.createElement("a-entity");
      let leg = document.createElement("a-entity");
      let leg2 = document.createElement("a-entity");
      let leg3 = document.createElement("a-entity");
      let leg4 = document.createElement("a-entity");


      desk.setAttribute("mixin", "desk");
      leg.setAttribute("position", "0.5 -0.25 0.5");
      leg.setAttribute("mixin", "leg");
      leg2.setAttribute("position", "-0.5 -0.25 0.5");
      leg2.setAttribute("mixin", "leg");
      leg3.setAttribute("position", "0.5 -0.25 -0.5");
      leg3.setAttribute("mixin", "leg");
      leg4.setAttribute("position", "-0.5 -0.25 -0.5");
      leg4.setAttribute("mixin", "leg");
      desk.appendChild(leg)
      desk.appendChild(leg2)
      desk.appendChild(leg3)
      desk.appendChild(leg4)

      this.el.appendChild(desk);

    }
  })

  AFRAME.registerPrimitive("a-table", {
    defaultComponents: {
      table: {}
    }
  })
/* 

    "aframe": "^1.7.1",
    "aframe-extras": "^7.5.4",
    "aframe-physics-system": "git://github.com/n5ro/aframe-physics-system.git"
    


    <a-asset-item id="eva" src="/models/eva-animated-complete.glb"></a-asset-item>



        <!-- Character -->
        <a-entity character class="selectable" ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true;" position="-2 5 -3">
            <a-entity gltf-model="#eva" log-gltf-animations ammo-shape="type: hull;" animation-mixer="clip: CharacterArmature|Idle;" position="0 -1.1 -1" rotation="0 0 0" scale="1 1 1"></a-entity>
            
            <!-- Health bar group, positioned above the object -->
            <a-entity position="0 1.6 0" face-camera visible="false">
                <!-- Background bar -->
                <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                <!-- Foreground bar (dynamic health) -->
                <a-plane id="health-bar" shader="flat" color="green" width="1" height="0.1" position="0 0 0.01"></a-plane>
            </a-entity>
        </a-entity>        
        <!-- Character -->
        <a-entity character class="selectable" ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true;" position="-2 5 -3">
            <a-entity gltf-model="#eva" log-gltf-animations ammo-shape="type: hull;" animation-mixer="clip: CharacterArmature|Idle;" position="0 -1.1 -1" rotation="0 0 0" scale="1 1 1"></a-entity>
            
            <!-- Health bar group, positioned above the object -->
            <a-entity position="0 1.6 0" face-camera visible="false">
                <!-- Background bar -->
                <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                <!-- Foreground bar (dynamic health) -->
                <a-plane id="health-bar" shader="flat" color="green" width="1" height="0.1" position="0 0 0.01"></a-plane>
            </a-entity>
        </a-entity> 



  */
document.querySelector('#app').innerHTML = `
    <div id="selectionBox"></div>

    <a-scene physics="driver: ammo; debug: true; debugDrawMode: 1;">

      
        <!-- External files -->
        <a-assets>
            <a-asset-item id="tree" src="/models/tree/tree.gltf"></a-asset-item>
            <a-asset-item id="eva" src="/models/Units/Soldier/Character_Soldier.glb"></a-asset-item>
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
    

        <!-- Character -->
        <a-entity character class="selectable" ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true;" position="-2 5 -3">
            <a-entity class="target" gltf-model="#eva" log-gltf-animations ammo-shape="type: hull;" animation-mixer="clip: CharacterArmature|Idle;" position="0 -1.1 -1" rotation="0 0 0" scale="1 1 1"></a-entity>
            
            <!-- Health bar group, positioned above the object -->
            <a-entity position="0 1.6 0" face-camera visible="false">
                <!-- Background bar -->
                <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                <!-- Foreground bar (dynamic health) -->
                <a-plane id="health-bar" shader="flat" color="green" width="1" height="0.1" position="0 0 0.01"></a-plane>
            </a-entity>
        </a-entity>



        <!-- Obstacles -->
        <a-sphere drop ammo-body="type: dynamic" ammo-shape="type: box" obstacle="strength: 100"  position="2 5 -3" radius="0.5" color="orange"></a-sphere>
        <a-sphere drop ammo-body="type: dynamic" ammo-shape="type: box" obstacle="strength: 100"  position="4 5 -2" radius="0.5" color="orange"></a-sphere>
    

        <!-- Character -->
        <a-entity>
            <a-entity character class="selectable" ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="-12 5 -8" scale="0.1 0.1 0.1" rotation="0 0 0">
                <a-entity gltf-model="#buldoz" log-gltf-animations ammo-shape="type: hull;" position="0 -5 0" rotation="0 0 0" scale="1 1 1"></a-entity>
                
                <!-- Health bar group, positioned above the object -->
                <a-entity position="0 6.6 0" face-camera scale="10 10 10" visible="false">
                    <!-- Background bar -->
                    <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                    <!-- Foreground bar (dynamic health) -->
                    <a-plane id="health-bar" shader="flat" color="green" width="1" height="0.1" position="0 0 0.01"></a-plane>
                </a-entity>
            </a-entity>
        </a-entity>
        <!-- Character -->
        <a-entity character class="selectable" ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 40; emitCollisionEvents: true;" position="-10 5 -3" scale="0.2 0.2 0.2" rotation="0 0 0">
            <a-entity gltf-model="#dump" log-gltf-animations ammo-shape="type: hull;" position="0 -2 0" rotation="0 0 0" scale="1 1 1">
                <a-plane color="red" width="3" height="3" position="0 3 0" rotation="-90 0 0"></a-plane>
            </a-entity>
            
            <!-- Health bar group, positioned above the object -->
            <a-entity position="0 4.6 0" face-camera scale="5 5 5" visible="false">
                <!-- Background bar -->
                <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                <!-- Foreground bar (dynamic health) -->
                <a-plane id="health-bar" shader="flat" color="green" width="1" height="0.1" position="0 0 0.01"></a-plane>
            </a-entity>
        </a-entity>



        <!-- Enemy -->
        <a-entity enemy ammo-body="type: dynamic; angularFactor: 0 0 0; mass: 20; emitCollisionEvents: true;" position="-2 5 15">
            <a-entity class="clickable target" gltf-model="#enemy" log-gltf-animations ammo-shape="type: hull;" animation-mixer="clip: CharacterArmature|Idle;" position="0 -1.15 -0.8" rotation="0 0 0" scale="1 1 1"></a-entity>
            
            <!-- Health bar group, positioned above the object -->
            <a-entity position="0 1.6 0" face-camera visible="true">
                <!-- Background bar -->
                <a-plane color="gray" shader="flat" width="1" height="0.1" position="0 0 0"></a-plane>

                <!-- Foreground bar (dynamic health) -->
                <a-plane id="health-bar" shader="flat" color="red" width="1" height="0.1" position="0 0 0.01"></a-plane>
            </a-entity>
        </a-entity> 





      








          <a-assets>
          <a-mixin id="desk" geometry="primitive:box; height:0.05;" material="color: red"></a-mixin>
          <a-mixin id="leg" geometry="primitive:box; height:0.5; width:0.05;depth:0.05;" material="color: blue"></a-mixin>
      </a-assets>
      <!--<a-table position="0 1 5" dynamic-body="mass: 1; angularDamping: 1; shape: box;"></a-table>
      --> 



  <!-- Character
      <a-entity character class="obstacle unit" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 5.4 -5" scale="0.1 0.1 0.1">
        <a-entity gltf-model="#mining" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1" shadow="cast: true">
        </a-entity>
      </a-entity>

      <a-entity character class="obstacle unit" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 5.4 -10" scale="0.5 0.5 0.5" rotation="0 180 0">
        <a-entity gltf-model="#dump" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 0 0" scale="1 1 1" shadow="cast: true">
            <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7; castShadow: true;" position="0 2 -4" rotation="0 0 0"></a-entity>
        </a-entity>
      </a-entity>

      <a-entity character class="obstacle unit" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 5.4 -15" scale="0.2 0.2 0.2" rotation="0 180 0">
      <a-entity gltf-model="#dump" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 0 0" scale="1 1 1" shadow="cast: true">
        <a-plane color="red" width="3" height="3" position="0 0.7 0" rotation="0 90 0"></a-plane>
        <a-plane color="red" width="3" height="3" position="0 3 0" rotation="0 90 0"></a-plane>
          <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7; castShadow: true;" position="0 2 -4" rotation="0 0 0"></a-entity>
          
      </a-entity>
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

  <a-entity character class="obstacle unit" dynamic-body="mass: 1; angularDamping: 1; shape: box;" position="-2 0.4 -3">
  <a-entity gltf-model="#eva" log-gltf-animations animation-mixer="clip: idle;" position="0 0 0" rotation="0 90 0" scale="1 1 1" shadow="cast: true">
      <a-entity light="type: spot; penumbra: 0.2; angle: 50; intensity: 3; distance: 7; castShadow: true;" position="0 1 0" rotation="0 180 0"></a-entity>
  </a-entity>
  <a-entity raycaster="direction: 1 0 0; far: 2;" position="0 0.5 0" rotation="0 0 0" collider-check></a-entity>
</a-entity>
 -->
      <!--  tree   <a-entity static-body obstacle class="obstacle" gltf-model="#tree" position="2 0 -6" scale="0.2 0.2 0.2" shadow="cast: true;"></a-entity> 
      -->
      
      <!-- Obstacles
      <a-entity static-body obstacle class="obstacle" geometry="primitive: box; width: 5; height: 2; depth: 2" position="3 0.5 -9"></a-entity>
      <a-entity static-body obstacle class="obstacle" geometry="primitive: box; width: 5; height: 2; depth: 2" position="3 0.5 -3"></a-entity>

  
      <a-sphere obstacle="strength: 9999" dynamic-body="mass: 0.3;" position="2 1 -3" radius="0.5" color="orange" shadow="cast: true"></a-sphere>
      <a-sphere obstacle="strength: 9999" position="2 1 -1" radius="0.5" material="shader: glowing; transparent: true; color1: red; color2: blue; uMap: #ball;"></a-sphere>
      -->
      
      <!--  ground <a-box class="clickable obstacle" nav-mesh  id="navmesh" static-body="friction: 0;" position="0 0 -2" width="130" height="0.2" depth="130" material="src: #grass; repeat: 5 5;" shadow="receive: true"></a-box> 
      --> 
  
      <!-- Obstacles
          <a-sphere ammo-body="type: dynamic" ammo-shape="type: box" obstacle="strength: 100"  position="2 5 -3" radius="0.5" color="orange"></a-sphere>
          <a-sphere ammo-body="type: dynamic" ammo-shape="type: box" obstacle="strength: 100"  position="4 5 -2" radius="0.5" color="orange"></a-sphere>
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
