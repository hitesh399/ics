'use strict'

class AppValidationFormatter {
  constructor() {
    this.errors = {}
  }

  addError(error, field, validation, args) {
    let message = error

    if (error instanceof Error) {
      // validation = 'ENGINE_EXCEPTION'
      message = error.message
    }
    if (this.errors[field] === undefined) {
      this.errors[field] = []
    }
    this.errors[field].push(message)
  }

  // return null if no errors are present,
  // otherwise validate will be rejected with an empty
  // error
  toJSON() {
    return Object.keys(this.errors).length ? this.errors : null
  }
}

module.exports = AppValidationFormatter
