import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';

import eclipseVertex from './src/shader/eclipseVertex.glsl';
import eclipseFragment from './src/shader/eclipseFragment.glsl';
import atmosphereVertex from './src/shader/atmosphereVertex.glsl';
import atmosphereFragment from './src/shader/atmosphereFragment.glsl';

//

require('normalize.css/normalize.css');
require("./src/css/index.css");

//

let scene, camera, renderer, composer;
let controls, container, eclipse, atmosphere;
let stats;

//

window.onload = function () {

    initScene();
    initStats();

    initObjects();
    initControls();

    animate();

}

//

function initScene() {

    scene = new THREE.Scene();

    container = document.getElementById('canvas');

    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
    );

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);

    camera.position.z = 5;
    camera.position.x = 4;
    camera.position.y = 3;
    camera.lookAt(0,0,0)

}

//

function initStats() {

    var axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );

    stats = new Stats();
    document.body.appendChild(stats.dom);

}

//

function initObjects() {

    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var material = new THREE.ShaderMaterial( { 
        color: 0x000000,
        vertexShader: eclipseVertex,
        fragmentShader: eclipseFragment,
    } );
    eclipse = new THREE.Mesh( geometry, material );   
    
    scene.add( eclipse )

    geometry = new THREE.SphereGeometry(1, 32, 32);
    material = new THREE.ShaderMaterial( { 
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    } );

    atmosphere = new THREE.Mesh( geometry, material );   
    atmosphere.scale.set(1.1, 1.1, 1.1);

    scene.add(atmosphere);
}

//

function initControls() {

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;

}

//

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    stats.update();

    renderer.render(scene, camera);
}

//
// EVENT LISTENERS
//

window.addEventListener('resize', onWindowResize, false);
window.addEventListener('click', onClick, false);

//

function onWindowResize() {
    container = document.getElementById('canvas');

    var width = container.offsetWidth;
    var height = container.offsetHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);
}

//

function onClick(e) {
    
}   
