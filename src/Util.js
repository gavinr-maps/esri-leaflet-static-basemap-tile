import { request } from 'esri-leaflet';

// URL of the static basemap tiles service (currently in Beta)
const baseUrl = 'https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/beta';

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

  // Remove initial '/' if included in style string
  if (style[0] === '/') style = style.replace('/', '');

  let url = `${baseUrl}/${style}/static/tile/{z}/{y}/{x}?token=${accessToken}`;

  if (options.language) {
    url = `${url}&language=${options.language}`;
  }

  return url;
}

/**
 * Utility to make a /self request to the static basemap tiles service
 * @param {string} accessToken
 * @returns {Object} A list of all supported basemap styles, including thumbnail URLs and supported language codes.
 */
export async function getSelf (accessToken) {
  if (!accessToken) throw new Error('An access token is required to access the static basemap tiles service.');

  const selfUrl = baseUrl + '/self';
  return new Promise((resolve, reject) => {
    request(selfUrl, { token: accessToken }, (error, resp) => {
      if (error) reject(error);
      resolve(resp);
    });
  });
}
