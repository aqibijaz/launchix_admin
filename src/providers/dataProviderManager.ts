// providers/dataProviderManager.ts

import { planDataProvider } from "./planDataProvider";
import { userDataProvider } from "./userDataProvider";

// For multiple data providers, use this structure:
export const dataProviders = {
  default: userDataProvider,
  users: userDataProvider,
  plans: planDataProvider,
};
