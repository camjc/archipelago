import THREE from 'three';

const sun = ({ oceanColor, skyColor }) => {

  var hemisphereLight = new THREE.HemisphereLight( skyColor, oceanColor, 0 );
  hemisphereLight.position.set( 0, 500, 0 );

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.2 );
  directionalLight.position.set( 0, 0.75, 1 );
  directionalLight.position.multiplyScalar( 50);

  return { directionalLight, hemisphereLight };
}


export default sun;
