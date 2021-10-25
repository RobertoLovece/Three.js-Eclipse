import * as THREE from 'three';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// composer
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';

// shaders
import eclipseVertex from './src/shader/eclipseVertex.glsl';
import eclipseFragment from './src/shader/eclipseFragment.glsl';
import atmosphereVertex from './src/shader/atmosphereVertex.glsl';
import atmosphereFragment from './src/shader/atmosphereFragment.glsl';

//

import { BLOOMPARAMS, FILMPARAMS } from './src/config.js';
import { initGUI } from './src/GUI.js';

//

import Stars from './src/stars/stars.js'

//

require('normalize.css/normalize.css');
require("./src/css/index.css");

//

let scene, camera, renderer;
let composer, bloomPass, filmPass;
let controls, container, stats, clock;
let eclipse, atmosphere, stars;

//

window.onload = function () {

    initScene();
    initPostProcessing();

    initObjects();
    initControls();

    initStats();
    initGUI(bloomPass, filmPass);

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

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);

    camera.position.x = 2.83;
    camera.position.y = 0.55;
    camera.position.z = 1.52;
    camera.lookAt(0,0,0)

}

//

function initPostProcessing() {

    var exposure = 1;
    renderer.toneMappingExposure = Math.pow(exposure, 4.0);

    composer = new EffectComposer(renderer);

    var renderPass = new RenderPass(scene, camera);

    // resolution, strength, radius, threshold
    bloomPass = new UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
	
    bloomPass.strength = BLOOMPARAMS.bloomStrength;
    bloomPass.threshold = BLOOMPARAMS.bloomThreshold;
	bloomPass.radius = BLOOMPARAMS.bloomRadius;

    var smaaPass = new SMAAPass( window.innerWidth * renderer.getPixelRatio(), window.innerHeight * renderer.getPixelRatio() );

    // noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale
    filmPass = new FilmPass(
        FILMPARAMS.noiseIntensity,   
        FILMPARAMS.scanlinesIntensity,  
        FILMPARAMS.scanlinesCount,
        FILMPARAMS.grayscale,  
    );

    renderPass.renderToScreen = false;
    bloomPass.renderToScreen = false;
    smaaPass.renderToScreen = true;
    filmPass.renderToScreen = false;

    composer.addPass(renderPass);
    composer.addPass(bloomPass);
    composer.addPass(smaaPass);
    composer.addPass(filmPass);

}

//

function initObjects() {

    var geometry = new THREE.SphereGeometry(1, 128, 128);
    var material = new THREE.ShaderMaterial( { 
        color: 0x000000,
        vertexShader: eclipseVertex,
        fragmentShader: eclipseFragment,
    } );
    eclipse = new THREE.Mesh( geometry, material );   
    
    scene.add( eclipse )

    geometry = new THREE.SphereGeometry(1, 128, 128);
    material = new THREE.ShaderMaterial( { 
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        // blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    } );

    atmosphere = new THREE.Mesh( geometry, material );   
    atmosphere.scale.set(1.2, 1.2, 1.2);

    scene.add(atmosphere);

    stars = new Stars(3000);
    
    scene.add(stars);
}

//

function initControls() {

    controls = new OrbitControls(camera, renderer.domElement);

    controls.enablePan = true;
    controls.enableZoom = true;
    controls.enableRotate = true;

}

//

function initStats() {

    // var axesHelper = new THREE.AxesHelper( 5 );
    // scene.add( axesHelper );

    stats = new Stats();
    document.body.appendChild(stats.dom);

    clock = new THREE.Clock();
}

//

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    stats.update();

    var damp = 0.008;
    stars.rotation.y += -.1 * damp;

    // renderer.render(scene, camera);
    var delta = clock.getDelta();
    composer.render(delta);
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
    composer.setPixelRatio(window.devicePixelRatio);
    composer.setSize(width, height);
}

//

function onClick(e) {
    console.log(camera.position)
}   
