// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { domain, clientId, api } from '../auth_config.json';

export const environment = {

  production: false,

  auth: {
    domain: domain,
    clientId: clientId,
    redirectUri: window.location.origin,
    // audience: audience
  },

  api: api,

  securedUrls: [
    `${api}/*`
  ],

  defaultImageUrl: 'https://media-exp1.licdn.com/dms/image/C4D1BAQFAC3o2eHS_vA/company-background_10000/0/1565182814457?e=2159024400&v=beta&t=zWT-JPXEhmCFr0L8eTn0LswSz82VWuuJBkRuPAvLN-Q'

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
