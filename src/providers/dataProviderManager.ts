// providers/dataProviderManager.ts
// Multi-provider setup for different resources

import { userDataProvider } from "./userDataProvider";

// For multiple data providers, use this structure:
export const dataProviders = {
  default: userDataProvider,
  users: userDataProvider,
  // Add more providers as you create them:
  // brands: brandDataProvider,
  // subscriptions: subscriptionDataProvider,
};

// If you only have one provider for now, you can also export it directly:
// export { userDataProvider as dataProviders };