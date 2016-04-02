import THREE from 'three';
import warningIslandImg from './images/island2.jpg'


const island = (config = {}) => {
  const loader = new THREE.TextureLoader();
  const planeWidth = config.width * 1.7;
  const geometryResolution = Math.pow(2, 1)
  const geometry = new THREE.PlaneGeometry( planeWidth, planeWidth, geometryResolution, geometryResolution );
  const warningIslandMap = loader.load(warningIslandImg);
  const height = Math.max((config.height * 5), 1)

  const goodMaterial = new THREE.MeshPhongMaterial({
    color: 0x30e961,
    displacementMap: warningIslandMap,
    displacementScale: height,
    shading: THREE.FlatShading,
    shininess: 100
  });

  const warningMaterial = new THREE.MeshPhongMaterial({
    color: 0xeabb8f,
    displacementMap: warningIslandMap,
    displacementScale: height,
    shading: THREE.FlatShading,
    shininess: 100
  });

  const dangerMaterial = new THREE.MeshPhongMaterial({
    color: 0xe93061,
    displacementMap: warningIslandMap,
    displacementScale: height,
    shading: THREE.FlatShading,
    shininess: 100
  });

  const material = (() => {
    switch (false) {
      case !(config.primaryHealth > 0.6):
        return goodMaterial;
      case !(config.primaryHealth > 0.4):
        return warningMaterial;
      default:
        return dangerMaterial;
    }
  })();
  const islandMesh = new THREE.Mesh( geometry, material );
  islandMesh.rotateX(-(Math.PI / 2));
  islandMesh.rotateZ(Math.random() * Math.PI);
  islandMesh.position.y = -0.01;
  islandMesh.castShadow = true;
  islandMesh.receiveShadow = false;

  return islandMesh;
}

export default island;
