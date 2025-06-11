// ✅ main.ts — Entry Point (Angular's Main Engine Starter)
// What it does: It's the starting point of the Angular app and It tells Angular to start the app using a root module (AppModule).


// ➡️ Loads Angular's browser engine to run the app dynamically (JIT - Just In Time compiler).
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
// ➡️ Imports the root Angular module that defines everything your app needs.
import { AppModule } from './app/app.module'; // root module 

// ➡️ This boots (starts) the app using AppModule.
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
