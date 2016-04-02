import THREE from 'three';

import FlyControls from './controls';
import sun from './sun';
import archipelago from './archipelago';
import createOcean from './ocean';
import data from './data';

const oceanColor = 0x0b1048;
const skyColor = 0x0e30b4;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000000 );
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.gammaInput = true;
renderer.gammaOutput = true;

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );



const archipelagoIslands = archipelago( data );
for (let island of archipelagoIslands) {
  scene.add( island.island );
}


// Lighting
const {directionalLight, hemisphereLight, skyMesh} = sun({oceanColor, skyColor});
scene.add(directionalLight);
scene.add(hemisphereLight);
scene.add(skyMesh);


// Ocean
const {mirrorMesh, groundMirror} = createOcean({camera, renderer});
scene.add(mirrorMesh);


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

  groundMirror.render()
  renderer.render(scene, camera);
};
render();
