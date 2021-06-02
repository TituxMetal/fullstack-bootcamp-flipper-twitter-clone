import { inProd } from '#root/config'

const errorHandler = (error, req, res, next) => {
  if (req.headersSent) {
    return next(error)
  }

  const errorDetails = { details: error.message, status: error.status }

  if (!errorDetails.status) {
    errorDetails.status = error.statusCode || 500
  }

  if (!inProd) {
    console.error(errorDetails)
  }

  return res
    .status(errorDetails.status)
    .render('error', { message: errorDetails.details })
}

export default errorHandler
