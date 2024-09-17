/* eslint-env mocha */
const apiKey = '1234';
const basemapStyle = 'arcgis/outdoor';

describe('StaticBasemapTileLayer', () => {
    it('should save the style enumeration from the constructor - basemapStyle', function () {
        const layer = L.esri.Tile.staticBasemapTileLayer(basemapStyle);
    
        expect(layer.options.style).to.equal(basemapStyle);
      });
})