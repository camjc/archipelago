import THREE from 'three';
import subtleNoiseImg from './images/subtleNoise.jpg'
import warningIslandImg from './images/island2.jpg'
import goodIslandDiffuseImg from './images/goodIsland_diffuse1024.jpg'
import goodIslandDisplacementImg from './images/goodIsland_displacement.jpg'


const island = (config = {}) => {
  const loader = new THREE.TextureLoader();
  const planeWidth = config.width * 1.7;
  const geometry = new THREE.PlaneGeometry( planeWidth, planeWidth, 128, 128 );
  const subtleNoiseMap = new loader.load(subtleNoiseImg);
  const largerNoiseMap = new loader.load(subtleNoiseImg);
  const warningIslandMap = new loader.load(warningIslandImg);
  subtleNoiseMap.wrapS = subtleNoiseMap.wrapT = THREE.RepeatWrapping;
  subtleNoiseMap.repeat.x = 2;
  subtleNoiseMap.repeat.y = 2;
  const height = Math.max(config.height, 0.2)

  const goodMaterial = new THREE.MeshPhongMaterial({
    map: new loader.load(goodIslandDiffuseImg),
    displacementMap: new THREE.TextureLoader().load(goodIslandDisplacementImg),
    displacementScale: height,
    shininess: 1,
    color: 0xffffff
  });

  const warningMaterial = new THREE.MeshPhongMaterial({
    map: subtleNoiseMap,
    specularMap: subtleNoiseMap,
    displacementMap: warningIslandMap,
    displacementScale: height,
    color: 0x555577
  });

  const dangerMaterial = new THREE.MeshPhongMaterial({
    map: largerNoiseMap,
    shininess: 100,
    displacementMap: warningIslandMap,
    displacementScale: height,
    color: 0x110000
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
  islandMesh.position.y = -0.01
  return islandMesh;
}

export default island;
