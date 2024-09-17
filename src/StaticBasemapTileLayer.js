import { TileLayer, setOptions } from 'leaflet';
import { getStaticBasemapTilesUrl, fetchAttribution } from './Util';
import { Util } from 'esri-leaflet';

export var StaticBasemapTileLayer = TileLayer.extend({
  initialize: function (style, options) {
    if (options) {
      setOptions(this, options);
    }
    // support outdated casing apiKey of apikey
    if (this.options.apiKey) {
      this.options.apikey = this.options.apiKey;
    }

    // if apiKey is passed in, propagate to token
    // if token is passed in, propagate to apiKey
    if (this.options.apikey) {
      this.options.token = this.options.apikey;
    } else if (this.options.token) {
      this.options.apikey = this.options.token;
    }

    // if no style passed in
    if (!style) {
      throw new Error(
        'A valid style enum is required for staticBasemapTileLayer (ex. arcgis/streets).'
      );
    }

    // Add an initial '/' if not included in style string
    if (style[0] !== '/') style = '/' + style;

    // Save style into "this.options" for use elsewhere in the module.
    this.options.style = style;
    this.serviceUrl = getStaticBasemapTilesUrl(style, this.options.token, this.options);

    TileLayer.prototype.initialize.call(this, this.serviceUrl, this.options);
  },
  // Override method of L.Layer
  getAttribution: function () {
    Util.setEsriAttribution(this._map);
    console.log('TOKEN', this.options.token);
    return new Promise((resolve, reject) => {
      fetchAttribution(this.options.style, this.options.token).then((resp) => {
        resolve(resp.copyrightText);
      });
    });
  }
});

export function staticBasemapTileLayer (key, options) {
  return new StaticBasemapTileLayer(key, options);
}
