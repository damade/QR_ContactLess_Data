type ErrorWithMessage = {
    message: string
  }
  
  function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof (error as Record<string, unknown>).message === 'string'
    )
  }
  
  function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
    if (isErrorWithMessage(maybeError)) return maybeError
  
    try {
      return new Error(JSON.stringify(maybeError))
    } catch {
      // fallback in case there's an error stringifying the maybeError
      // like with circular references for example.
      return new Error(String(maybeError))
    }
  }
  
export const getErrorMessage = (error: unknown) =>{
    return toErrorWithMessage(error).message
}

export const PaystackErrorBuilder = (object, statusCode) => {
   object["statusCode"] = statusCode
   return object
}