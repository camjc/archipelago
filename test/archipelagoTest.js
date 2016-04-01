/* eslint-env node, mocha */
/* global expect */
/* eslint no-console: 0 */
'use strict';

import data from '../src/data';
import archipelago from '../src/archipelago';


describe('src/archipelago', () => {

  it('should generate island archipelago', () => {
    let archipelagoIslandList = archipelago( data );
    expect(archipelago(data)).to.have.lengthOf(16);
  });

});
