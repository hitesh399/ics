'use strict'

class AppResponse {
  constructor() {
    this.response = null
    this.data = {
      data: null,
      errors: null,
      error: null,
      message: null
    }
  }
  setResponse(response) {
    this.response = response
    return this
  }
  setErrors(errors) {
    this.data['errors'] = errors
    return this
  }
  setMessage(message) {
    this.data['message'] = message
    return this
  }
  setError(error) {
    this.data['error'] = error
    return this
  }
  setData(data) {
    this.data['data'] = data
    return this
  }
  get all() {
    return this.data
  }
  get json() {
    return JSON.stringify(this.all)
  }
  out(status = 200, json = true) {
    if (json) {
      this.response.header('Content-type', 'application/json')
    }
    return this.response.status(status).json(this.json)
  }

  throw422(errors) {
    const ValidationException = use('App/Exceptions/ValidationException')
    throw new ValidationException(errors)
  }
  clear() {
    this.data = {
      data: null,
      errors: null,
      error: null,
      message: null
    }
  }
}

module.exports = AppResponse
