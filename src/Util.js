/**
 * Utility to establish a URL for the static basemap tiles API
 *
 * @param {string} style
 * @param {string} accessToken
 * @param {Object} [options] Optional list of parameters: language.
 * @returns {string} the URL
 */
export function getStaticBasemapTilesUrl (style, accessToken, options) {
  // URL of the static basemap tiles service
  if (!accessToken) throw new Error('An access token is required to access basemap styles.');

  const baseUrl = 'https://static-map-tiles-api.arcgis.com/arcgis/rest/services/static-basemap-tiles-service/beta';
  let url = `${baseUrl}/${style}/static/tile/{z}/{y}/{x}?token=${accessToken}`;

  if (options.language) {
    url = `${url}&language=${options.language}`;
  }

  return url;
}
