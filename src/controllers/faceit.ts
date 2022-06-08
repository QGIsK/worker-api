import type {Context} from 'worktop';
import {reply} from 'worktop/response';

// @ts-ignore
import FaceitAPI from '@cstools-app/faceit-wrapper';

// @ts-ignore No undef
// eslint-disable-next-line no-undef
const FaceitClient = new FaceitAPI(FACEIT_KEY, (...args) => fetch(...args));

export const get = async (_req: Request, ctx: Context) => {
  const id = ctx.url.searchParams.get('id');
  const username = ctx.url.searchParams.get('username');
  const game = ctx.url.searchParams.get('game');

  if (!id && !username) return reply(422, {errors: 'Username and ID required'});

  const profile = username ?
    await FaceitClient.players.get({nickname: username}) :
    await FaceitClient.players.show({player_id: id});

  const gameIndex = game ? game : 'csgo';

  if (profile.errors || !profile.games[gameIndex]) return reply(404, 'Player statistics not found');

  const skillLevel = profile.games[gameIndex].skill_level;
  const elo = profile.games[gameIndex].faceit_elo;

  const icon = buildIconUrl(profile.games[gameIndex].skill_level);
  const profileUrl = buildProfileUrl('en/players', profile.nickname);

  return reply(200, {
    skillLevel,
    elo,
    icon,
    profileUrl,
  });
};


const buildIconUrl = (level: String) =>
  `https://cdn.demiann.dev/images/faceit/levels/level${level}.svg`;

const buildProfileUrl = (type: String, nickname: String) =>
  `https://faceit.com/${type}/${nickname}`;
