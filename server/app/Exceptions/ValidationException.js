'use strict'


const { LogicalException } = require('@adonisjs/generic-exceptions')

class ValidationException extends LogicalException {

  constructor(errors) {
    super({ errors, error: errors[Object.keys(errors)[0]] }, 422)
  }
}

module.exports = ValidationException
