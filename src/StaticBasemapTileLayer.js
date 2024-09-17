import { TileLayer, setOptions } from 'leaflet';
import { getStaticBasemapTilesUrl } from './Util';

export var StaticBasemapTileLayer = TileLayer.extend({
  options: {},
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

    // set key onto "this.options" for use elsewhere in the module.
    this.options.style = style;
    this.styleUrl = getStaticBasemapTilesUrl(style, this.options.token, this.options);

    TileLayer.prototype.initialize.call(this, this.styleUrl, this.options);
  },
  // Method of L.Layer
  getAttribution: function () {
    // TODO
  }

});

export function staticBasemapTileLayer (key, options) {
  return new StaticBasemapTileLayer(key, options);
}
