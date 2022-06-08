import type {FaceitProfile} from 'types/models/faceit';

const faceitAPI = 'https://api.faceit.com/search/v1/?limit=1&query=';

export const findFaceitProfile = async (
    steamID: string,
): Promise<FaceitProfile | undefined> => {
  const response = await fetch(faceitAPI + steamID);
  const data: { payload: { players: { results: never[] } } } =
    await response.json();

  return data.payload.players.results[0];
};
