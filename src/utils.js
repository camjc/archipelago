import uuid from 'node-uuid';
import constants from './constants';


const ISLAND = constants.ARCH_ITEM_TYPE.ISLAND;
const MOUNT = constants.ARCH_ITEM_TYPE.MOUNT;
const GAP = constants.ARCH_ITEM_TYPE.GAP;


/**
 * Circle edge length: 2 * PI * r
 * Arch length: Teta * r (Teta is an angle in radians)
 * Chorda length: 2 * r * sin(Teta / 2)
 */

const calculateItemPositionProperties = (item, proportion, observationRadius) => {
  let itemArchLen = item.w;

  let teta = itemArchLen * proportion / observationRadius;
  let itemChordaLen = 2 * observationRadius * Math.sin(teta / 2);

  return {
    width: Math.floor(itemChordaLen),
    angle: teta,
    type: item.type
  }
};


const calculateIslandMountains = (mountains, proportion, observationRadius, startAngle) => {
  let teta = 0;
  let _mountains = mountains.map((mountain) => {
    let positionProperties = calculateItemPositionProperties(mountain, proportion, observationRadius);
    positionProperties.start = startAngle + teta;
    teta += positionProperties.angle;
    return {
      id: mountain.id,
      positionProperties: positionProperties,
      primaryHealth: mountain.primaryHealth,
      secondaryHealth: mountain.secondaryHealth,
      size: mountain.size
    }
  });

  return {
    mountains: _mountains,
    endAngle: teta,
    startAngle: startAngle
  }
};


const calculateProportion = (itemList, observationRadius) => {
  let width_sum = 0;

  // caclculate length of arch (half circle, 180 degrees)
  for (let i = 0; i < itemList.length; i++) {
    let item = itemList[ i ];
    switch (item.type) {
      case GAP:
        width_sum += item.w;
        break;
      case ISLAND:
        width_sum += item.mountains.reduce((result, mountain) => {
          result += mountain.w;
          return result;
        }, 0);
        break;
      default: break;
    }
  }

  if (width_sum === 0) {
    throw new Error('itemList width sum is 0, cannot calculate arch positions');
  }

  // get proportion coefficient between radius and arch length
  // width_sum * k = PI * r
  return Math.PI * observationRadius / width_sum;
}


/**
 * For each item in item list this function will return item width and
 * position (in radians) where the left corner of item should be located
 *
 * @param {Object} itemList The list of items we should spread on the arch,
 *                          every item is
 * { id: islandId, type: 'island', mountains: [{ id: XXXX, w: 10, type: 'mount' }] }
 *                          `w` - width proportion on the arch, not real width
 *
 * @returns {Object} in format {itemId: { width: Number, angle: Number, start: Number }, ...}
 */
const calculateArchPositions = (itemList, observationRadius) => {
  const k = calculateProportion(itemList, observationRadius);
  let startAngle = 0;
  return itemList.reduce((result, item) => {
    switch (item.type) {
      case GAP:
        result[item.id] = calculateItemPositionProperties(item, k, observationRadius);
        result[item.id].start = startAngle;
        startAngle += result[item.id].angle;
        break;
      case ISLAND:
        const island = calculateIslandMountains(item.mountains, k, observationRadius, startAngle);
        result[item.id] = {
          id: item.id,
          type: item.type,
          mountains: island.mountains,
          startAngle: island.startAngle,
          endAngle: island.endAngle
        }
        // island.mountains.map((mountain) => {
        //   result[mountain.id] = mountain.positionProperties;
        // });
        startAngle += island.endAngle;
        break;
      default: break;
    }

    return result;
  }, {});
};


const siteDataToIslandItemsList = (siteData, mountWidth) => {

  return Object.keys(siteData).reduce((result, lineItemID) => {
    result.push({
      id: lineItemID,
      w: mountWidth,
      type: MOUNT,
      primaryHealth: siteData[lineItemID].primaryHealth,
      secondaryHealth: siteData[lineItemID].secondaryHealth,
      size: siteData[lineItemID].size
    });
    return result;
  }, []);

};


const sellerDataToIslandItemsList = (sellerData, siteGap, mountWidth) => {

  return Object.keys(sellerData).reduce((result, siteID, index) => {
    result.push({
      id: siteID,
      mountains: siteDataToIslandItemsList(sellerData[siteID], mountWidth),
      type: ISLAND
    });

    if (index < Object.keys(sellerData).length - 1) {
      result.push({
        id: uuid.v4(),
        w: siteGap,
        type: GAP
      });
    }
    return result;
  }, []);

};


/**
 * @param   {Object} data in format { SellerID: { SiteID: { LineItemID: { health: XXXX } } } }
 *
 * @returns {Array} [ { id: 'X1', w: 10, type: ... }, { id: 'X2', w: 1, type: ... } ]
 */
const dataToIslandItemsList = (data, sellerGap, siteGap, mountWidth) => {

  return Object.keys(data).reduce((result, sellerID, index) => {
    result = result.concat(sellerDataToIslandItemsList(data[sellerID], siteGap, mountWidth));

    if (index < Object.keys(data).length - 1) {
      result.push({
        id: uuid.v4(),
        w: sellerGap,
        type: GAP
      });
    }
    return result;
  }, []);

};


export default {
  calculateArchPositions,
  siteDataToIslandItemsList,
  sellerDataToIslandItemsList,
  dataToIslandItemsList
};
