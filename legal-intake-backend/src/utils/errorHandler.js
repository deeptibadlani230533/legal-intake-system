function errorHandler(error, request, reply) {
  // 🔹 AJV Validation Errors
  if (error.validation) {
    const formattedErrors = error.validation.map(err => {
      const field = err.instancePath.replace("/", "");

      if (err.keyword === "minLength") {
        return `${field} must be at least ${err.params.limit} characters long`;
      }

      if (err.keyword === "format") {
        return `${field} is not in correct format`;
      }

      if (err.keyword === "enum") {
        return `${field} contains invalid value`;
      }

      if (err.keyword === "required") {
        return `${err.params.missingProperty} is required`;
      }

      return `${field} ${err.message}`;
    });

    return reply.code(400).send({
      success: false,
      message: formattedErrors.join(", "),
    });
  }

  // 🔹 Custom ApiError
  const statusCode = error.statusCode || 500;

  reply.code(statusCode).send({
    success: false,
    message: error.message || "Internal Server Error",
  });
}

module.exports = errorHandler;