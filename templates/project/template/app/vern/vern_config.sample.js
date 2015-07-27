module.exports = {
  name: '{{appName}} API',
  use_ssl: false, // generally better to use a proxy service on nginx/apache than to direct
  ssl_key: '',
  ssl_crt: '',
  base_dir: __dirname + '/',
  controllers_dir: __dirname + '/controllers',
  models_dir: __dirname + '/models',
  CORS_HEADERS: [],
  // CORS_ORIGINS: ['*'],
  registration_on: false,
  pre_registration_on: false,
  registration_activates: true,
  pre_register_email_activation: false,
  strict_logins: false,
  reserved_usernames: [
    'default',
    'admin',
    'administrator',
    'moderator',
    'root',
    'system'
  ],
  available_permissions: [''],
  default_group_privacy: 'private',
  enable_user_group_policy: true,
  create_user_group_on_registration: true,
  max_groups_per_user: 0,
  env: {

    // Development
    development: {
      web_host: 'http://localhost',
      port: 3458,
      // Database, CouchDB
      dbdriver: 'mongodb',
      databases: {
        mongodb: {
          db: 'mongodb://localhost/{{dbName}}',
          user: '',
          password: ''
        }
      }
    },

    // Add more environments...

    // Production
    production: {
      web_host: 'https://www.mydomain.com',
      port: 3458,
      // Database, CouchDB
      dbdriver: 'mongodb',
      databases: {
        mongodb: {
          db: 'mongodb://localhost/{{dbName}}',
          user: '',
          password: ''
        }
      }
    }

  }
};
