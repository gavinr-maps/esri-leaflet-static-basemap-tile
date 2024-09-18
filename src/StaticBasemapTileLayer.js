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
    // if no access token provided
    if (!this.options.token) {
      throw new Error(
        'An ArcGIS access token is required for static basemap tiles. To learn more, go to https://developers.arcgis.com/documentation/security-and-authentication/'
      );
    }
    // if no style passed in
    if (!style) {
      throw new Error(
        'A valid style code is required for staticBasemapTileLayer (ex. arcgis/streets).'
      );
    }

    // Add an initial '/' if not included in style string
    if (style[0] !== '/') style = '/' + style;

    // Save style into "this.options" for use elsewhere in the module.
    this.options.style = style;
    this.serviceUrl = getStaticBasemapTilesUrl(style, this.options.token, this.options);

    TileLayer.prototype.initialize.call(this, this.serviceUrl, this.options);
  },
  onAdd: function () {
    // Mirrors code from L.GridLayer
    this._initContainer();

    this._levels = {};
    this._tiles = {};

    this._resetView(); // implicit _update() call
    // Setup Esri attribution
    this._setupAttribution();
  },
  _setupAttribution: function () {
    if (!this._map) return;
    Util.setEsriAttribution(this._map);
    fetchAttribution(this.options.style, this.options.token).then(attribution => {
      this._map.attributionControl.addAttribution(attribution);
    });
  }
});

export function staticBasemapTileLayer (key, options) {
  return new StaticBasemapTileLayer(key, options);
}
