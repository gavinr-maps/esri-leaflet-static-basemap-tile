/* eslint-env mocha */
const accessToken = "AAPTxy8BH1VEsoebNVZXo8HurMAwC1wsop8pF-rMn8orEgZratsupxbkACReqyraDOJQK8gwfM_h0H2dp-9vTF49xqmDTYvHvq1xE18wRcHyCVd0IsWQjfKerzoLo8VGxFKW4Fn-sb2tJxAVAMmP7MuBeOSouN0XtLa_6dXL2jnvAp1HfRdj-gGHD1a0K8_jvmy4TQaZNNEZkeWYIGMGnY6XsVFUWLsm4zY7QyFgAGVPJsSQ6mvLtvqHzUCpwGjXC1h_AT1_Rboi2xCi";
const basemapStyle = '/arcgis/outdoor';
const basemapStyleNoSlash = 'arcgis/outdoor';

describe('StaticBasemapTileLayer', () => {
    it('should save the style enumeration from the constructor - basemapStyle', function () {
        const layer = L.esri.Tile.staticBasemapTileLayer(basemapStyle, {token:accessToken});
    
        expect(layer.options.style).to.equal(basemapStyle);
      });
    it('should prepend an initial slash to the style enumeration if none is present - basemapStyleNoSlash', function () {
      const layer = L.esri.Tile.staticBasemapTileLayer(basemapStyleNoSlash, {token:accessToken});
    
      expect(layer.options.style).to.equal('/'+basemapStyleNoSlash);
    })
})