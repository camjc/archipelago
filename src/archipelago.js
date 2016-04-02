import constants from './constants';
import utils from './utils';
import island from './island';

const OBSERVATION_RADIUS = constants.OBSERVATION_RADIUS;
const MOUNT_WIDTH = constants.MOUNT_WIDTH;
const SITE_GAP = constants.SITE_GAP;
const SELLER_GAP = constants.SELLER_GAP;
const MOUNT = constants.ARCH_ITEM_TYPE.MOUNT;
const ISLAND = constants.ARCH_ITEM_TYPE.ISLAND;
const RADIUS_FLUCTUATION = constants.RADIUS_FLUCTUATION;


const getRadiusFluctuation = (groupId) => {
  const signum = (Math.random() >= 0.5) ? 1 : -1;
  return signum * Math.random() * RADIUS_FLUCTUATION;
}


const getRadius = (groupId) => {
  return OBSERVATION_RADIUS + getRadiusFluctuation(groupId);
}


const getAngle = (angle, groupId) => {

  const signum = (Math.random() >= 0.5) ? 1 : -1;
  return angle + signum * Math.random() * 0.01;
}


const calculateMountain = (mountain, groupId) => {
  const cube_side = mountain.positionProperties.width;
  let _island = island({
    width: cube_side,
    height: cube_side,
    depth: cube_side,
    height: mountain.size,
    primaryHealth: mountain.primaryHealth,
    secondaryHealth: mountain.secondaryHealth,
    groupId: groupId,
    id: mountain.id
  });
  const angle = getAngle(mountain.positionProperties.start, groupId);
  const radius = getRadius(groupId);
  _island.position.x = Math.cos(angle) * radius;
  _island.position.z = Math.sin(angle + Math.PI) * radius;
  return _island;
}


const calculateIsland = (island) => {
  return island.mountains.map((mountain) => {
    return {
      id: mountain.id,
      island: calculateMountain(mountain, island.id)
    }
  });
}


const archipelago = (data) => {
  const islandList = utils.dataToIslandItemsList(data, SELLER_GAP, SITE_GAP, MOUNT_WIDTH);
  const archPositions = utils.calculateArchPositions(islandList, OBSERVATION_RADIUS);

  return Object.keys(archPositions).reduce((result, itemId) => {
    const item = archPositions[itemId];

    switch (item.type) {
      case MOUNT:
        break;
        // const cube_side = item.width;
        // let _island = island({ color: 0x00ff00, width: cube_side, height: cube_side, depth: cube_side });
        // _island.position.x = Math.cos(item.start) * OBSERVATION_RADIUS;
        // _island.position.z = Math.sin(item.start + Math.PI) * OBSERVATION_RADIUS;
        // result.push({
        //   id: itemId,
        //   island: _island
        // });
      case ISLAND:
        result = result.concat(calculateIsland(item));
        break;
      default: break;
    }
    return result;
  }, []);
}


export default archipelago;
