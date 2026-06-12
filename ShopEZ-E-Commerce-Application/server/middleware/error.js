export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  const status = res.statusCode >= 400 ? res.statusCode : 500;
  const message =
    error.name === "ValidationError"
      ? Object.values(error.errors).map((item) => item.message).join(", ")
      : error.message;
  res.status(status).json({ message });
}
