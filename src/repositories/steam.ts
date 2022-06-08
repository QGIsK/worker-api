import type {SteamProfile} from 'types/models/steam';
// import SteamResolver from '@qgisk/steamresolver';

// @ts-ignore TODO :: Define
// const client = new SteamResolver((...args: any) => fetch(...args));
const apiBase = 'http://api.steampowered.com';

export const getFromVanityURL = async (
    steamCustom: string,
): Promise<string> => {
  const parsedSteamCustom = parseParams(steamCustom);
  // @ts-ignore env key
  // eslint-disable-next-line no-undef
  const url = `${apiBase}/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_KEY}&vanityurl=${parsedSteamCustom}`;

  const res = await fetch(url);
  const json: { response: { steamid: string; success: number } } =
    await res.json();
  return json.response.steamid;
};

export const getSteamProfile = async (
    steamID: string,
): Promise<SteamProfile | undefined> => {
  // @ts-ignore env key
  // eslint-disable-next-line no-undef
  const url = `${apiBase}/ISteamUser/GetPlayerSummaries/v0002/?key=${STEAM_KEY}&steamids=${steamID}`;
  const res = await fetch(url);
  const json: { response: { players: SteamProfile[] } } = await res.json();
  return json.response.players[0];
};

export const fromCustom = async (persona: string) => {
  const parsedPersona = parseParams(persona);
  const id = await getFromVanityURL(parsedPersona);

  return getSteamProfile(id);
};

const parseParams = (param: string) => {
  if (param.includes('steamcommunity.com/')) {
    const split = param.split('/');

    const index = param.endsWith('/') ? 2 : 1;

    return split[split.length - index];
  }
  return param;
};
