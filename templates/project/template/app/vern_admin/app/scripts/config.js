'use strict';

angular.module('config', []).constant('config', {
  devHost: 'http://0.0.0.0:3458/',
  //productionHost: 'https://api.vern.io/',
  productionHost: 'https://localhost/api',
  sessionName: 'vernAdminUser',
  defaultLanguage: 'en',
  language: this.defaultLanguage,
  routes: {
    public: [
      {
        path: '/',
        templateUrl: 'templates/main.html',
        innerTemplateUrl: 'views/main/index.html',
        controller: 'MainCtrl',
        event: 'home'
      }
    ],
    publicRestricted: [
      // For User account (public) sections
      {
        path: '/dashboard',
        templateUrl: 'templates/account.html',
        innerTemplateUrl:'views/main/account/index.html',
        controller: 'AccountMainCtrl',
        event: 'account.main'
      }
    ],
    misc: [
      // For 3rd party connections
    ],
    admin: [
      // For Admin panel page
    ],
    default: [
      {
        path: '/:module',
        templateUrl: 'templates/account.html',
        innerTemplateUrl:'views/main/account/index.html',
        controller: 'AccountMainCtrl'
      },
      {
        path: '/:module/:action',
        templateUrl: 'templates/account.html',
        innerTemplateUrl:'views/main/account/index.html',
        controller: 'AccountMainCtrl'
      },
      {
        path: '/404',
        templateUrl: 'templates/error.html',
        innerTemplateUrl: 'views/errors/404.html'
      },
      {
        path: '/403',
        templateUrl: 'templates/error.html',
        innerTemplateUrl: 'views/errors/403.html'
      }
    ]
  },
  months: [
    {
      name: 'January',
      value: 1
    },
    {
      name: 'February',
      value: 2
    },
    {
      name: 'March',
      value: 3
    },
    {
      name: 'April',
      value: 4
    },
    {
      name: 'May',
      value: 5
    },
    {
      name: 'June',
      value: 6
    },
    {
      name: 'July',
      value: 7
    },
    {
      name: 'August',
      value: 8
    },
    {
      name: 'September',
      value: 9
    },
    {
      name: 'October',
      value: 10
    },
    {
      name: 'November',
      value: 11
    },
    {
      name: 'December',
      value: 12
    }
  ],
  // this is so inefficient lol, change
  years: [
    {
      name: new Date().getFullYear(),
      value: new Date().getFullYear()
    },
    {
      name: new Date().getFullYear()+1,
      value: new Date().getFullYear()+1
    },
    {
      name: new Date().getFullYear()+2,
      value: new Date().getFullYear()+2
    },
    {
      name: new Date().getFullYear()+3,
      value: new Date().getFullYear()+3
    },
    {
      name: new Date().getFullYear()+4,
      value: new Date().getFullYear()+4
    },
    {
      name: new Date().getFullYear()+5,
      value: new Date().getFullYear()+5
    },
    {
      name: new Date().getFullYear()+6,
      value: new Date().getFullYear()+6
    },
    {
      name: new Date().getFullYear()+7,
      value: new Date().getFullYear()+7
    }
  ],
  states:
    [
      {
        'name': 'Alberta',
        'value': 'AB'
      },
      {
        'name': 'Alabama',
        'value': 'AL'
      },
      {
        'name': 'Alaska',
        'value': 'AK'
      },
      {
        'name': 'American Samoa',
        'value': 'AS'
      },
      {
        'name': 'Arizona',
        'value': 'AZ'
      },
      {
        'name': 'Arkansas',
        'value': 'AR'
      },
      {
        'name': 'British Columbia',
        'value': 'BC'
      },
      {
        'name': 'California',
        'value': 'CA'
      },
      {
        'name': 'Colorado',
        'value': 'CO'
      },
      {
        'name': 'Connecticut',
        'value': 'CT'
      },
      {
        'name': 'Delaware',
        'value': 'DE'
      },
      {
        'name': 'District Of Columbia',
        'value': 'DC'
      },
      {
        'name': 'Federated States Of Micronesia',
        'value': 'FM'
      },
      {
        'name': 'Florida',
        'value': 'FL'
      },
      {
        'name': 'Georgia',
        'value': 'GA'
      },
      {
        'name': 'Guam',
        'value': 'GU'
      },
      {
        'name': 'Hawaii',
        'value': 'HI'
      },
      {
        'name': 'Idaho',
        'value': 'ID'
      },
      {
        'name': 'Illinois',
        'value': 'IL'
      },
      {
        'name': 'Indiana',
        'value': 'IN'
      },
      {
        'name': 'Iowa',
        'value': 'IA'
      },
      {
        'name': 'Kansas',
        'value': 'KS'
      },
      {
        'name': 'Kentucky',
        'value': 'KY'
      },
      {
        'name': 'Louisiana',
        'value': 'LA'
      },
      {
        'name': 'Manitoba',
        'value': 'MB'
      },
      {
        'name': 'Maine',
        'value': 'ME'
      },
      {
        'name': 'Marshall Islands',
        'value': 'MH'
      },
      {
        'name': 'Maryland',
        'value': 'MD'
      },
      {
        'name': 'Massachusetts',
        'value': 'MA'
      },
      {
        'name': 'Michigan',
        'value': 'MI'
      },
      {
        'name': 'Minnesota',
        'value': 'MN'
      },
      {
        'name': 'Mississippi',
        'value': 'MS'
      },
      {
        'name': 'Missouri',
        'value': 'MO'
      },
      {
        'name': 'Montana',
        'value': 'MT'
      },
      {
        'name': 'New Brunswich',
        'value': 'NB'
      },
      {
        'name': 'Nebraska',
        'value': 'NE'
      },
      {
        'name': 'Newfoundland and Labrador',
        'value': 'NL'
      },
      {
        'name': 'Nevada',
        'value': 'NV'
      },
      {
        'name': 'New Hampshire',
        'value': 'NH'
      },
      {
        'name': 'New Jersey',
        'value': 'NJ'
      },
      {
        'name': 'New Mexico',
        'value': 'NM'
      },
      {
        'name': 'New York',
        'value': 'NY'
      },
      {
        'name': 'North Carolina',
        'value': 'NC'
      },
      {
        'name': 'North Dakota',
        'value': 'ND'
      },
      {
        'name': 'Nova Scotia',
        'value': 'NS'
      },
      {
        'name': 'Northern Mariana Islands',
        'value': 'MP'
      },
      {
        'name': 'Ohio',
        'value': 'OH'
      },
      {
        'name': 'Oklahoma',
        'value': 'OK'
      },
      {
        'name': 'Ontario',
        'value': 'ON'
      },
      {
        'name': 'Oregon',
        'value': 'OR'
      },
      {
        'name': 'Palau',
        'value': 'PW'
      },
      {
        'name': 'Pennsylvania',
        'value': 'PA'
      },
      {
        'name': 'Prince Edward Island',
        'value': 'PE'
      },
      {
        'name': 'Puerto Rico',
        'value': 'PR'
      },
      {
        'name': 'Quebec',
        'value': 'QB'
      },
      {
        'name': 'Rhode Island',
        'value': 'RI'
      },
      {
        'name': 'South Carolina',
        'value': 'SC'
      },
      {
        'name': 'South Dakota',
        'value': 'SD'
      },
      {
        'name': 'Saskatchewan',
        'value': 'SK'
      },
      {
        'name': 'Tennessee',
        'value': 'TN'
      },
      {
        'name': 'Texas',
        'value': 'TX'
      },
      {
        'name': 'Utah',
        'value': 'UT'
      },
      {
        'name': 'Vermont',
        'value': 'VT'
      },
      {
        'name': 'Virgin Islands',
        'value': 'VI'
      },
      {
        'name': 'Virginia',
        'value': 'VA'
      },
      {
        'name': 'Washington',
        'value': 'WA'
      },
      {
        'name': 'West Virginia',
        'value': 'WV'
      },
      {
        'name': 'Wisconsin',
        'value': 'WI'
      },
      {
        'name': 'Wyoming',
        'value': 'WY'
      },
      {
        'name': 'Yukon',
        'value': 'YT'
      }
    ]
});