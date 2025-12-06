import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:5000",
    video: true,
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true
  },
});
