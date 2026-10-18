import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import { provideToastr } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';

export function tokenGetter() {
  return localStorage.getItem("DMCC_TOKEN");
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideEchartsCore({
      echarts
    }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideToastr(),
    importProvidersFrom(
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          allowedDomains: ["example.com"],
          disallowedRoutes: ["http://example.com/examplebadroute/"],
        },
      }),
    ),

  ]

};
