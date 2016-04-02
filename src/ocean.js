import THREE from 'three';
import {} from './mirrorShader';

const createOcean = ({camera, renderer}) => {
  const geometry = new THREE.PlaneGeometry( 200, 200);
  const groundMirror = new THREE.Mirror(renderer, camera, {
    clipBias: 0.003,
    textureWidth: Math.pow(2, 11),
    textureHeight: Math.pow(2, 11),
    color: 0x333333 }
  );

  var mirrorMesh = new THREE.Mesh(geometry, groundMirror.material);
  mirrorMesh.add(groundMirror);
  mirrorMesh.rotateX( - Math.PI / 2 );
  return {mirrorMesh, groundMirror};
}

export default createOcean
