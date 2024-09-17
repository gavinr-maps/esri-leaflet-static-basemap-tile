import packageInfo from '../package.json';
const version = packageInfo.version;
export { version as VERSION };

export { StaticBasemapTileLayer, staticBasemapTileLayer } from './StaticBasemapTileLayer';
export { getSelf } from './Util';

