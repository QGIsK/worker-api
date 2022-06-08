import type {Context} from 'worktop';
import {reply} from 'worktop/response';
import {digest} from 'worktop/crypto';

export const image = async (_req: Request, ctx: Context) => {
  const url = ctx.url.searchParams.get('url');

  if (!url) return reply(422, {errors: 'Url is required'});
  if (url.match(/\.(jpeg|jpg|gif|png)$/) === null) {
    return reply(422, {errors: 'URL Doesnt seem to be an image, or a gif.'});
  }

  const res = await fetch(url);
  if (!res || res.status !== 200) return reply(422, {errors: 'Bad request'});

  const original = await res.blob();

  const response = new Response(original);

  const ext = url.split('.').pop();
  const gif = ext === 'gif';

  // eslint-disable-next-line no-nested-ternary
  const mimeType = gif ?
    'image/gif' :
    ext === 'jpg' ?
    'image/jpeg' :
    'image/png';

  const key = await digest('MD5', url);

  response.headers.append(
      'Content-Disposition',
      `attachment; filename="${key}"`,
  );
  response.headers.append('Content-Type', mimeType);
  response.headers.append(
      'Cache-Control',
      'max-age=31536000, s-maxage=31536000',
  );

  return response;
};
