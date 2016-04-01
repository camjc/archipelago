/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import constants from '../src/constants';
import utils from '../src/utils';
import data from '../src/data';

const OBSERVATION_RADIUS = constants.OBSERVATION_RADIUS;
const MOUNT_WIDTH = constants.MOUNT_WIDTH;
const SITE_GAP = constants.SITE_GAP;
const SELLER_GAP = constants.SELLER_GAP;
const ISLAND = constants.ARCH_ITEM_TYPE.ISLAND;
const MOUNT = constants.ARCH_ITEM_TYPE.MOUNT;
const GAP = constants.ARCH_ITEM_TYPE.GAP;


describe('src/utils', () => {


  describe.skip('calculateArchPositions', () => {

    it('should throw an error when item list is empty', () => {
      expect(() => utils.calculateArchPositions([], 0))
        .to.throw(/itemList width sum is 0, cannot calculate arch positions/);
    });

    it('should return arch points positions', () => {
      const itemList = [
        { id: 'X1', w: 10, type: MOUNT },
        { id: 'X2', w: 1, type: GAP},
        { id: 'X3', w: 10, type: MOUNT },
        { id: 'X4', w: 2, type: GAP },
        { id: 'X5', w: 10, type: MOUNT }
      ];
      const archPositions = utils.calculateArchPositions(itemList, OBSERVATION_RADIUS);
      const epsilon = 0.00001

      let totalAngle = Object.keys(archPositions).reduce((result, itemId) => {
        result += archPositions[itemId].angle;
        return result;
      }, 0);
      expect(Math.abs(totalAngle - Math.PI) < epsilon).to.be.true;
    });

  });


  describe('siteDataToIslandItemsList()', () => {

    it('should parse line item data received via API to island items list', () => {
      let itemList = utils.siteDataToIslandItemsList(data["3605"]["4448"], MOUNT_WIDTH);
      expect(itemList).to.eql([
        {id: 'f67b0eeb-a06b-4672-93fe-8ff5267af482', w: MOUNT_WIDTH, type: MOUNT},
        {id: '7e751388-87ce-45cb-b88e-0cddfc2731a8', w: MOUNT_WIDTH, type: MOUNT},
        {id: '1b9cb93f-8035-49df-9423-d116cd2db2dc', w: MOUNT_WIDTH, type: MOUNT}
      ]);
    });

  });


  describe('sellerDataToIslandItemsList()', () => {

    it('should parse seller data received via API to island items list', () => {
      let itemList = utils.sellerDataToIslandItemsList(data["3605"], SITE_GAP, MOUNT_WIDTH);
      expect(itemList.length).to.equal(3);

      expect(itemList[ 0 ].id).to.equal('4448');
      expect(itemList[ 0 ].type).to.equal(ISLAND);
      expect(itemList[ 0 ].mountains.length).to.equal(3);

      expect(itemList[ 1 ].w).to.equal(SITE_GAP);
      expect(itemList[ 1 ].type).to.equal(GAP);

      expect(itemList[ 2 ].id).to.equal('4449');
      expect(itemList[ 2 ].type).to.equal(ISLAND);
      expect(itemList[ 2 ].mountains.length).to.equal(2);
    });

  });


  describe('dataToIslandItemsList()', () => {

    it('should parse API data to island items list', () => {
      let itemList = utils.dataToIslandItemsList(data, SELLER_GAP, SITE_GAP, MOUNT_WIDTH);
      expect(itemList.length).to.equal(9);

      expect(itemList[ 0 ].id).to.equal('3832');
      expect(itemList[ 0 ].type).to.equal(ISLAND);
      expect(itemList[ 0 ].mountains.length).to.equal(4);

      expect(itemList[ 1 ].w).to.equal(SELLER_GAP);
      expect(itemList[ 1 ].type).to.equal(GAP);

      expect(itemList[ 2 ].id).to.equal('3806');
      expect(itemList[ 2 ].type).to.equal(ISLAND);
      expect(itemList[ 2 ].mountains.length).to.equal(4);

      expect(itemList[ 3 ].w).to.equal(SITE_GAP);
      expect(itemList[ 3 ].type).to.equal(GAP);

      expect(itemList[ 4 ].id).to.equal('4450');
      expect(itemList[ 4 ].type).to.equal(ISLAND);
      expect(itemList[ 4 ].mountains.length).to.equal(3);

      expect(itemList[ 5 ].w).to.equal(SELLER_GAP);
      expect(itemList[ 5 ].type).to.equal(GAP);

      expect(itemList[ 6 ].id).to.equal('4448');
      expect(itemList[ 6 ].type).to.equal(ISLAND);
      expect(itemList[ 6 ].mountains.length).to.equal(3);

      expect(itemList[ 7 ].w).to.equal(SITE_GAP);
      expect(itemList[ 7 ].type).to.equal(GAP);

      expect(itemList[ 8 ].id).to.equal('4449');
      expect(itemList[ 8 ].type).to.equal(ISLAND);
      expect(itemList[ 8 ].mountains.length).to.equal(2);
    });

  });

});
