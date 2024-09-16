import { TileLayer, setOptions } from 'leaflet';
import { getStaticBasemapTilesUrl } from './Util';

export var StaticBasemapTileLayer = TileLayer.extend({
  initialize: (style, options) => {
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
        'A value style URL is required for staticBasemapTileLayer (ex. arcgis/streets).'
      );
    }

    // set key onto "this.options" for use elsewhere in the module.
    this.options.style = style;
    this._url = getStaticBasemapTilesUrl(style, this.options.token, this.options);
    console.log(this._url);
  },

  // Method of L.TileLayer
  getTileUrl: () => {
    console.log(this._url);
  },

  // Method of L.Layer
  getAttribution: () => {
    // TODO
  }

});

export function staticBasemapTileLayer (key, options) {
  return new StaticBasemapTileLayer(key, options);
}
