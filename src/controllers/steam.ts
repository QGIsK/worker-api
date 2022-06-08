import type {Context} from 'worktop';
import {reply} from 'worktop/response';

import {getSteamProfile, fromCustom} from '~/repositories/steam';

import * as Cache from '~/helpers/cache';

export const get = async (_req: Request, ctx: Context) => {
  const id = ctx.url.searchParams.get('id');
  const customUrl = ctx.url.searchParams.get('customUrl');

  if (!id && !customUrl) {
    return reply(422, {errors: 'id or customURL required'});
  }

  const profile = id ? await getSteamProfile(id) : await fromCustom(customUrl!);

  return reply(200, profile, Cache.month);
};

export const transform = async (_req: Request, ctx: Context) => {
  return reply(501, {error: 'Not implemented'});
  // const id = ctx.url.searchParams.get('id');
  // const customUrl = ctx.url.searchParams.get('customUrl');
  // const groupUrl = ctx.url.searchParams.get('groupUrl');

  // if (!id && !customUrl && !groupUrl) return reply(422, {errors: 'id, customUrl or groupUrl requried'});

  // // ID To custom url
  // if (id) {
  //   const customUrl = await Resolve.toCustomURL(id);

  //   return reply(200, {customUrl, url: buildSteamPath('id', customUrl as string)});
  // }

  // // Custom url To ID
  // if (customUrl) {
  //   const id = await Resolve.fromCustomURL(customUrl);

  //   return reply(200, {id, url: buildSteamPath('profiles', id as string)});
  // }

  // // Group URl to ID
  // const groupId = await Resolve.fromGroupURLToID(groupUrl!);

  // return reply(200, {groupId, url: buildSteamPath('gid', groupId as string)});
};

// const buildSteamPath = (type: String, path: String | Number) =>
//   `https://steamcommunity.com/${type}/${path}`;
