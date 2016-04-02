import THREE from 'three';
import {} from './skyShader';


const createSky = () => {
  const sky = new THREE.Sky();
  const inclination = 0.1;
  const azimuth = 0.02;
  sky.uniforms.turbidity.value = 20;
  sky.uniforms.reileigh.value = 1.2;
  sky.uniforms.luminance.value = 1;
  sky.uniforms.mieCoefficient.value = 0.01;
  sky.uniforms.mieDirectionalG.value = 0.85;

  var theta = Math.PI * (inclination - 0.5 );
  var phi = 2 * Math.PI * (azimuth - 0.5 );
  const distance = 100;
  const sunPosition = {};
  sunPosition.x = distance * Math.cos( phi );
  sunPosition.y = distance * Math.sin( phi ) * Math.sin( theta );
  sunPosition.z = distance * Math.sin( phi ) * Math.cos( theta );
  sky.uniforms.sunPosition.value.copy(sunPosition);

  return {skyMesh: sky.mesh, sunPosition};
}

const sun = ({ oceanColor, skyColor }) => {

  var hemisphereLight = new THREE.HemisphereLight( skyColor, 'purple', 0.2 );
  hemisphereLight.position.set( 0, 500, 0 );

  var directionalLight = new THREE.DirectionalLight( 0xebcfb9, 0.6 );

  // directionalLight.castShadow = true;
  // directionalLight.shadow.mapSize.width = directionalLight.shadow.mapSize.height = 1024*2;
  // var d = 25;
  //
  // directionalLight.shadow.camera.left = directionalLight.shadow.camera.bottom = -d;
  // directionalLight.shadow.camera.right = directionalLight.shadow.camera.top = d;
  // directionalLight.shadow.camera.near = 1;
  // directionalLight.shadow.camera.far = 200;
  // directionalLight.shadow.bias = -0.0001;


  const {skyMesh, sunPosition} = createSky();
  directionalLight.position.set(sunPosition.x, sunPosition.y, sunPosition.z);

  return { directionalLight, hemisphereLight, skyMesh };
}


export default sun;
