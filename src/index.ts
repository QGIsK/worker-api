import {Router} from 'worktop';
import * as CORS from 'worktop/cors';
import {start} from 'worktop/sw';
import * as Cache from 'worktop/cfw.cache';

import * as FaceitController from '~/controllers/faceit';
import * as SteamController from '~/controllers/steam';
import * as GithubController from '~/controllers/github';
import * as DownloaderController from '~/controllers/downloader';

const API = new Router();
API.prepare = Cache.sync();

declare global {
  /* eslint-disable no-unused-vars */
  const FACEIT_KEY: string;
  const STEAM_KEY: string;
  const GITHUB_KEY: string;
  /* eslint-enable no-unused-vars */
}

/**
 * Handles `OPTIONS` requests using the same settings.
 * NOTE: Call `CORS.preflight` per-route for individual settings.
 */
API.prepare = CORS.preflight({
  origin: '*', // allow any `Origin` to connect
  headers: ['Cache-Control', 'Content-Type'],
  methods: ['GET', 'HEAD', 'OPTIONS'],
});

API.add('GET', '/faceit', FaceitController.get);
API.add('GET', '/steam', SteamController.get);
API.add('GET', '/steam/transform', SteamController.transform);
API.add('GET', '/gh/pinned', GithubController.pinned);
API.add('GET', '/gh/pinned/details', GithubController.pinnedDetails);
API.add('GET', '/downloader/image', DownloaderController.image);

export default start(API.run);
