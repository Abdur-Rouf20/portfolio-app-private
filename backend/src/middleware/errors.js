export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  console.error(err);

  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal server error';
  if (err.name === 'ValidationError' || err.name === 'CastError' || err instanceof SyntaxError) status = 400;
  if (err.code === 11000) { status = 409; message = 'A record with this value already exists'; }
  if (status >= 500) message = 'Internal server error';
  res.status(status).json({ message });
}
