
import * as THREE from 'three';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

import Stats from 'three/addons/libs/stats.module.js';

// // Import our glTF model.
//import gltfUrl from '/scene/Fox/Fox.gltf';
//import gltfUrl from '/scene/CesiumMilkTruck/CesiumMilkTruck.gltf';
import gltfUrl from '/scene/Phoenix/phoenix_lowpoly.gltf';
import hdrUrl from '/scene/textures/royal_esplanade_1k.hdr';

let camera, scene, renderer;
let cameraControls;
let effectController;
let ambientLight, light;

let stats;
let shading;

init();
render();

function init() {

  const container = document.createElement( 'div' );
  document.body.appendChild( container );

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  // CAMERA
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 80000 );
  camera.position.set(  120, 120, 120 );

  // LIGHTS
  ambientLight = new THREE.AmbientLight( 0x333333 );

  light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
  light.position.set( 0.32, 0.39, 0.7 );

  // RENDERER
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( canvasWidth, canvasHeight );
  renderer.outputEncoding = THREE.sRGBEncoding;
  container.appendChild( renderer.domElement );

  // STATS
  stats = new Stats();
  container.appendChild( stats.dom );

  // EVENTS
  window.addEventListener( 'resize', onWindowResize );

  // CONTROLS
  cameraControls = new OrbitControls( camera, renderer.domElement );
  //controls.target.set( 0, 0, 0 );
  //controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;
  cameraControls.addEventListener( 'change', render );

  // SCENE
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xAAAAAA );

  scene.add( ambientLight );
  scene.add( light );

  // SETUP
  setupModel();

// // hdr LOADER
// new RGBELoader()
// //.setDataType(THREE.UnsignedByteType)
// .setDataType(THREE.HalfFloatType)
// .load(
//   hdrUrl,
//   //"https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/textures/equirectangular/royal_esplanade_1k.hdr",
//   function (texture) {
//     const pmremGenerator = new THREE.PMREMGenerator(renderer);
//     pmremGenerator.compileEquirectangularShader();
//     const envMap = pmremGenerator.fromEquirectangular(texture).texture;

//     scene.background = envMap; //this loads the envMap for the background
//     scene.environment = envMap; //this loads the envMap for reflections and lighting

//     texture.dispose(); //we have envMap so we can erase the texture
//     pmremGenerator.dispose(); //we processed the image into envMap so we can stop this
//   }
// );


  // GUI
  setupGui();
  render();

}

// EVENT HANDLERS

async function setupModel(){
  const gltf = await modelLoader(gltfUrl);
  const model = gltf.scene;
  model.scale.set( 10, 10, 10 );
  model.rotation.set( - Math.PI / 2, 0, 0 ); // z-up conversion

  scene.add( model );

  render();
}

function modelLoader(url) {
  return new Promise((resolve, reject) => {
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(url, data=> resolve(data), null, reject);
  });
}

function onWindowResize() {

  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight;

  renderer.setSize( canvasWidth, canvasHeight );

  camera.aspect = canvasWidth / canvasHeight;
  camera.updateProjectionMatrix();

  render();

}

function setupGui() {

  effectController = {
    newTess: 0,
    newShading: 'smooth'
  };

  const gui = new GUI();
  gui.add( effectController, 'newTess', [ 0, 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50 ] ).name( 'Control 1' ).onChange( render );
  gui.add( effectController, 'newShading', [ 'wireframe', 'flat', 'smooth', 'glossy', 'textured', 'reflective' ] ).name( 'Shading' ).onChange( render );

}

function render() {
  
  if(effectController.newShading !== shading)
  {
    shading = effectController.newShading;
  }

  if(shading === 'wireframe')
  {
    scene.traverse((node)=>{
      if(!node.isMesh) return;
      node.material.wireframe = true;
    });
  }
  else
  {
    scene.traverse((node)=>{
      if(!node.isMesh) return;
      node.material.wireframe = false;
    });
  }

  //controls.update();
  stats.update();
  renderer.render( scene, camera );

}