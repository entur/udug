# Udug

> Sometimes good, sometimes evil

A frontend application to display NeTEx validation reports from [antu](https://github.com/entur/antu).

# Application modes

Udug is designed to be run as a micro-frontend client, using https://github.com/entur/micro-frontend. 

However, it can also be run locally or even deployed as a standalone SPA by setting the env variable REACT_APP_STANDALONE. It then also expects Auth0 configuration for authentication with antu:

* REACT_APP_AUTH0_DOMAIN
* REACT_APP_AUTH0_CLIENT_ID
* REACT_APP_AUTH0_AUDIENCE
* REACT_APP_AUTH0_RELATIVE_CALLBACK_URL
# Configuration

Environment specific configuration is located in src/config/environments. The application loads the correct configuration using either the prop `env` from the micro-frontend payload, or the environment variable `REACT_APP_ENV` in standalone mode, defaulting to `dev` .

# i18n

Formatjs / react-intl is used for internationalization. When adding message descriptors, the npm script `extract-i18n` needs to be run in order to generate the translation keys in `lang/en.json` . Don't forget to add them to `lang/nb.json` . More languages can be added if needed.

The application loads the correct language by using the `locale` prop from the micro-frontend payload, or the environment variable `REACT_APP_LOCALE` in standalone mode, defaulting to `en` .
