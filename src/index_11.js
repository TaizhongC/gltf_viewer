import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

import gltfUrl from '/scene/Phonex/phonex_lowpoly.gltf';

let mixer;

const clock = new THREE.Clock();
const container = document.getElementById( 'container' );

const stats = new Stats();
container.appendChild( stats.dom );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild( renderer.domElement );

const pmremGenerator = new THREE.PMREMGenerator( renderer );

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xbfe3dd );
scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

// CAMERA
camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 80000 );
camera.position.set( - 100, 300, 300 );

// LIGHTS
ambientLight = new THREE.AmbientLight( 0x333333 );

light = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
light.position.set( 0.32, 0.39, 0.7 );

const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set( 0, 0.5, 0 );
controls.update();
controls.enablePan = false;
controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( 'jsm/libs/draco/gltf/' );

const loader = new GLTFLoader();
loader.setDRACOLoader( dracoLoader );
loader.load( gltfUrl, function ( gltf ) {

    const model = gltf.scene;
    model.position.set( 0, 0, 0 );
    model.scale.set( 1, 1, 1 );
    scene.add( model );

    // mixer = new THREE.AnimationMixer( model );
    // mixer.clipAction( gltf.animations[ 0 ] ).play();

    // animate();

}, undefined, function ( e ) {

    console.error( e );

} );


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

};


function animate() {

    requestAnimationFrame( animate );

    const delta = clock.getDelta();

    //mixer.update( delta );

    controls.update();

    stats.update();

    renderer.render( scene, camera );

}