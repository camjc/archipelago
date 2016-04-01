import THREE from 'three';

import FlyControls from './controls';
import sky from './sky';
import sun from './sun';
import archipelago from './archipelago';
import waterShader from './waterShader';
import waterNormalsImg from './images/waternormals.jpg'
import data from './data';

const oceanColor = 0x3d8b92;
const skyColor = 0xcfd6d9;

let scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.gammaInput = true;
renderer.gammaOutput = true;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

scene.add( sky(THREE) );
const archipelagoIslands = archipelago( data );
for (let island of archipelagoIslands) {
  scene.add( island.island );
}

// Lighting
const {directionalLight, hemisphereLight} = sun({oceanColor, skyColor});
scene.add( directionalLight );
scene.add( hemisphereLight );


// Ocean
const waterNormals = new THREE.TextureLoader().load(waterNormalsImg);
waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

const water = new THREE.Water(renderer, camera, scene, {
  waterNormals,
  sunDirection: directionalLight.position.normalize(),
  sunColor: 0xffffcc,
  waterColor: oceanColor,
  textureWidth: 1024,
  textureHeight: 1024,
  noiseScale: 0.01
});
var aMeshMirror = new THREE.Mesh(new THREE.PlaneBufferGeometry(300, 300, 1, 1), water.material);
aMeshMirror.add(water);
aMeshMirror.rotation.x = - Math.PI * 0.5;
scene.add(aMeshMirror);


// Camera
camera.setLens(35);


// Controls
const controls = new FlyControls(THREE, camera, renderer.domElement);
controls.rollSpeed = 0.005;
controls.movementSpeed = 0.03;
controls.dragToLook = true;

const render = function () {
  requestAnimationFrame( render );
  controls.update(1);

  camera.position.y = Math.max(camera.position.y, 0.1); // Stop us flying through the floor

  water.material.uniforms.time.value += 1 / 60;
  water.render();
  renderer.render(scene, camera);
};
render();
