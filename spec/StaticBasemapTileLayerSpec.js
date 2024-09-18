/* eslint-env mocha */
const accessToken = "1234";
const basemapStyle = '/arcgis/outdoor';
const basemapStyleNoSlash = 'arcgis/outdoor';
const languageCode = 'fr';

describe('StaticBasemapTileLayer', () => {
    it('should save the style enumeration from the constructor - basemapStyle', function () {
        const layer = L.esri.Tile.staticBasemapTileLayer(basemapStyle, {token:accessToken});
    
        expect(layer.options.style).to.equal(basemapStyle);
    });
    it('should prepend an initial slash to the style enumeration if none is present - basemapStyleNoSlash', function () {
      const layer = L.esri.Tile.staticBasemapTileLayer(basemapStyleNoSlash, {token:accessToken});
    
      expect(layer.options.style).to.equal('/'+basemapStyleNoSlash);
    });
    it('should accept a language parameter - languageCode', function () {
      const layer = L.esri.Tile.staticBasemapTileLayer(basemapStyle, {token:accessToken, language:languageCode});
    
      expect(layer.options.language).to.equal(languageCode);
    });
    it('should support the token parameter and propagate to the outdated apikey param - accessToken', function () {
      const layer = L.esri.Tile.staticBasemapTileLayer(basemapStyle, {token:accessToken});
      expect(layer.options.token).to.equal(accessToken);
      expect(layer.options.apikey).to.equal(accessToken);
    });
    it('should support the apikey param and alternate spelling apiKey - accessToken', function () {
      const layer1 = L.esri.Tile.staticBasemapTileLayer(basemapStyle, {apikey:accessToken});
      expect(layer1.options.token).to.equal(accessToken);
      expect(layer1.options.apikey).to.equal(accessToken);

      const layer2 = L.esri.Tile.staticBasemapTileLayer(basemapStyle, {apiKey:accessToken});
      expect(layer2.options.token).to.equal(accessToken);
      expect(layer2.options.apikey).to.equal(accessToken);
    });
    it('should error if no style code is provided', function () {
      expect(function () {
        L.esri.Tile.staticBasemapTileLayer('',{token:accessToken});
      }).to.throw('A valid style code is required for staticBasemapTileLayer (ex. arcgis/streets).');
    });
    it('should error if no access token is provided', function () {
      expect(function () {
        L.esri.Tile.staticBasemapTileLayer(basemapStyle);
      }).to.throw('An ArcGIS access token is required for static basemap tiles. To learn more, go to https://developers.arcgis.com/documentation/security-and-authentication/');
    });
    it('should create static tiles in the \'tilePane\' by default', function () {
      const layer = L.esri.Tile.staticBasemapTileLayer(basemapStyle,{token:accessToken});
      expect(layer.options.pane).to.equal('tilePane');
    })
})