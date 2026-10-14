import handler from '../../netlify/functions/blog-comments.mjs';

export default async function blogComments(req, res) {
  const body = req.body == null ? undefined : JSON.stringify(req.body);
  const response = await handler(new Request('http://localhost/api/blog-comments', { method: req.method, headers: { 'content-type': req.headers['content-type'] || 'application/json', 'x-forwarded-for': req.headers['x-forwarded-for'] || req.socket.remoteAddress || '' }, body }));
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.status(response.status).send(await response.text());
}
