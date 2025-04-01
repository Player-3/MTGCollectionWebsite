import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';

Amplify.configure({
  ...amplifyconfig,
  storage: {
    plugins: {
      awsS3StoragePlugin: {
        bucket: 'mywebsitemtgbucket',
        region: 'eu-north-1',
      },
    },
  },
});

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));