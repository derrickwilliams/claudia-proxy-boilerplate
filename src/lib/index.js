function handler(ev, ctx) {
  ctx.succeed({
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: ev
  });
}

export { handler };