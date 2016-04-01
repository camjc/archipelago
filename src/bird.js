import THREE from 'three';

const bird = (config = {}) => {
  const radius = 0.025;
  const widthSegments = 3;
  const heightSegments = 2;
  const phiStart = 0;
  const phiLength = Math.PI / 4;
  const thetaStart = 0;
  const thetaLength = Math.PI;
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
  const material = new THREE.MeshBasicMaterial( {color: 0xFF9966} );

  const birdMesh = new THREE.Mesh( geometry, material );
  birdMesh.position.y = 1.5;
  birdMesh.rotation.z = Math.PI / 2;
  return birdMesh;
}


export default bird;

