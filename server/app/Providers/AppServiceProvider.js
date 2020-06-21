const { ServiceProvider } = require('@adonisjs/fold')



class AppServiceProvider extends ServiceProvider {

  register() {
  }

  boot() {
    const app = this.app

    const AppValidationFormatter = use('App/Utils/AppValidationFormatter')
    const Response = use('Adonis/Src/Response')
    const Validation = use('Adonis/Addons/Validator')

    /**
     * Configure the Validation Message Format.
     */
    Validation.configure({
      FORMATTER: AppValidationFormatter
    })

    // console.log('app', this)

    /**
     * App API Response Structure
     */
    Response.getter('api', function () {

      if (this['app_response_instance']) {
        return this['app_response_instance']
      }
      const appRes = app.use('App/Utils/AppResponse')
      const res = (new appRes()).setResponse(this)
      this['app_response_instance'] = res
      return this['app_response_instance']
    })

  }
}

module.exports = AppServiceProvider
