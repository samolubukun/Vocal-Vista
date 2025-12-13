/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as chatHistory from "../chatHistory.js";
import type * as dailyLogs from "../dailyLogs.js";
import type * as products from "../products.js";
import type * as scanRecommendations from "../scanRecommendations.js";
import type * as skinScans from "../skinScans.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  chatHistory: typeof chatHistory;
  dailyLogs: typeof dailyLogs;
  products: typeof products;
  scanRecommendations: typeof scanRecommendations;
  skinScans: typeof skinScans;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
