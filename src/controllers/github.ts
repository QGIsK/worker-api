import type {Context} from 'worktop';
import type {CheerioAPI} from 'cheerio';
import type {
  PinnedList,
  PinnedItem,
  PinnedItemDetailed,
} from 'types/models/github';

import * as cheerio from 'cheerio';
import {reply} from 'worktop/response';

export const pinned = async (_req: Request, ctx: Context) => {
  const username = ctx.url.searchParams.get('username');

  if (!username) return reply(422, {errors: 'username is required'});

  const url = buildProfile(username);
  try {
    const res = await fetch(url);

    const body = await res.text();
    const $ = cheerio.load(body);

    const items: PinnedList = [];


    $('.js-pinned-item-list-item').each((_i, elem) => {
      const basic = simpleParsed($, elem);

      const item: PinnedItem = {...basic};
      items.push(item);
    });

    return reply(200, items);
  } catch (_err) {
    return reply(404, 'Profile cannot be found.');
  }
};

export const pinnedDetails = async (_req: Request, ctx: Context) => {
  const username = ctx.url.searchParams.get('username');

  if (!username) return reply(422, {errors: 'username is required'});

  try {
    const url = buildProfile(username);

    const res = await fetch(url);

    const body = await res.text();
    const $ = cheerio.load(body);

    const items: PinnedList = [];

    $('.js-pinned-item-list-item').each((_i, elem) => {
      const basic = simpleParsed($, elem);

      const item: PinnedItem = {...basic};

      items.push(item);
    });

    const detailedItemsPromises: Promise<PinnedItemDetailed>[] = await getDetailed(items);
    // TODO :: Refactor this
    const detailedItems = await Promise.all(detailedItemsPromises);
    return reply(200, detailedItems);
  } catch (_err) {
    return reply(404, 'Profile cannot be found.');
  }
};

const simpleParsed = ($: CheerioAPI, elem: any) => {
  const repoName: string = $(elem).find('a > span.repo').text();
  const repoLink: string = $(elem).find('a').attr('href') || '';
  const repoAbout: string = $(elem).find('p.pinned-item-desc').text().trim();
  const repoLanguage: string = $(elem)
      .find('*[itemprop = \'programmingLanguage\']')
      .text();
  const repoLanguageColor: string =
    $(elem).find('.repo-language-color').attr('style') || '';
  const repoOwner = repoLink.split('/').filter((el) => el.length > 0)[0];

  return {
    name: repoName,
    owner: repoOwner,
    repo: repoLink,
    repository: buildRepo(repoLink),
    about: repoAbout,
    language: repoLanguage,
    languageColor: repoLanguageColor.split(':')[1].trim(),
  };
};

const getDetailed = async (items: any[]) => {
  return await items.map(async (item: any) => {
    const url = buildApi(item.repo);

    const res = await fetch(url, {
      // @ts-ignore No undef
      // eslint-disable-next-line no-undef
      headers: {Authorization: `token ${GITHUB_KEY}`},
    });

    const parsed = detailedParsed(res?.body);

    return {...parsed, ...item};
  });
};

const detailedParsed = (res: any): PinnedItemDetailed => {
  const {
    homepage,
    forks,
    subscribers_count: watchers,
    topics,
    license,
    open_issues_count: issues,
    stargazers_count: stars,
    archived,
    created_at: createdAt,
    updated_at: updatedAt,
  } = res;

  return {
    homepage,
    stars,
    watchers,
    forks,
    issues,
    license,
    topics,
    archived,
    createdAt,
    updatedAt,
  };
};

const buildProfile = (username: string) => `https://github.com/${username}`;
const buildApi = (path: string) => `https://api.github.com/repos/${path}`;
const buildRepo = (repo: string) => `https://github.com/${repo}`;
