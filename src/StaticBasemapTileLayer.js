/* Copyright 2024 Esri
 *
 * Licensed under the Apache License Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { TileLayer, setOptions } from 'leaflet';
import { getStaticBasemapTilesUrl, fetchAttribution } from './Util';
// import { Util } from 'esri-leaflet';

// In the future, get this from Esri Leaflet Util:
const POWERED_BY_ESRI_ATTRIBUTION_STRING = 'Powered by <a href="https://www.esri.com">Esri</a>';

export var StaticBasemapTileLayer = TileLayer.extend({
  initialize: function (style, options) {
    if (options) {
      setOptions(this, options);
    }
    // support outdated casing apiKey of apikey
    if (this.options.apiKey) {
      this.options.apikey = this.options.apiKey;
    }
    // propagate apikey to token and vice versa
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
    // If no style passed in
    if (!style) {
      throw new Error(
        'A valid style enum is required for staticBasemapTileLayer (e.g. \'beta/arcgis/streets\').'
      );
    }
    if (!style.includes('beta')) {
      throw new Error(
        'The basemap styles service is currently in beta. All style enums must begin with \'beta\' (e.g. \'beta/arcgis/outdoor\').'
      );
    }
    // Set layer pane
    if (options.pane) {
      this.options.pane = options.pane;
    } else if (style.includes('/labels')) {
      this.options.pane = 'esri-labels';
    }

    this.options.zoomOffset = -1;
    this.options.tileSize = 512;

    // Save style into "this.options" for use elsewhere in the module.
    this.options.style = style;
    this.serviceUrl = getStaticBasemapTilesUrl(style, this.options.token, this.options);

    TileLayer.prototype.initialize.call(this, this.serviceUrl, this.options);
  },
  onAdd: function (map) {
    // Setup Esri attribution
    this._setupAttribution();

    this._initPane();

    TileLayer.prototype.onAdd.call(this, map);
  },
  onRemove: function (map) {
    this._removeAttribution();
    TileLayer.prototype.onRemove.call(this, map);
  },
  _setupAttribution: function () {
    if (!this._map) return;
    fetchAttribution(this.options.style, this.options.token).then(attribution => {
      // Add attribution directly to map
      this.currentAttribution = `${POWERED_BY_ESRI_ATTRIBUTION_STRING} | ${attribution}`;
      this._map.attributionControl.addAttribution(this.currentAttribution);
    });
  },
  _removeAttribution: function () {
    if (this.currentAttribution) {
      this._map.attributionControl.removeAttribution(this.currentAttribution);
      this.currentAttribution = undefined;
    }
  },
  _initPane: function () {
    if (this._map.getPane(this.options.pane)) return;

    const pane = this._map.createPane(this.options.pane);
    pane.style.pointerEvents = 'none';

    // Default value for tileLayer
    let zIndex = 200;
    if (this.options.pane === 'esri-labels') zIndex = 300;
    pane.style.zIndex = zIndex;
  }
});

export function staticBasemapTileLayer (key, options) {
  return new StaticBasemapTileLayer(key, options);
}
