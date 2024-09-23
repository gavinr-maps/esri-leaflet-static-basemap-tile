import { request } from 'esri-leaflet';

// URL of the static basemap tiles service (currently in Beta)
const baseUrl = 'https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service';

/**
 * Utility to establish a URL for the static basemap tiles API
 *
 * @param {string} style
 * @param {string} accessToken
 * @param {Object} [options] Optional list of parameters: language.
 * @returns {string} the URL
 */
export function getStaticBasemapTilesUrl (style, accessToken, options) {
  if (!accessToken) throw new Error('An access token is required to access the static basemap tiles service.');

  // Tile endpoint in {z}/{y}/{x} format
  let url = baseUrl + style + '/static/tile/{z}/{y}/{x}?token=' + accessToken;

  // Handle additional service parameters
  if (options.language) {
    url += '&language=' + options.language;
  }

  return url;
}

/**
 * Utility that retrieves attribution data for a given style
 * @param {string} style
 * @param {string} accessToken
 * @returns The attribution data from the '/static' endpoint of a style enumeration
 */
export async function fetchAttribution (style, accessToken) {
  const attributionUrl = baseUrl + style + '/static';
  return new Promise((resolve, reject) => {
    request(attributionUrl, { token: accessToken }, (error, resp) => {
      if (error) reject(error);
      resolve(resp.copyrightText);
    });
  });
}

/**
 * Utility to make a /self request to the static basemap tiles service
 * @param {string} accessToken
 * @returns {Object} A list of all supported basemap styles, including thumbnail URLs and supported language codes.
 */
export async function getSelf (accessToken) {
  if (!accessToken) throw new Error('An access token is required to access the static basemap tiles service.');

  const selfUrl = baseUrl + '/beta/self';
  return new Promise((resolve, reject) => {
    request(selfUrl, { token: accessToken }, (error, resp) => {
      if (error) reject(error);
      resolve(resp);
    });
  });
}

export var EsriUtil = {
  getSelf: getSelf
};

export default EsriUtil;
