import * as configcatcommon from "configcat-common";
import { IConfigCatClient, LogLevel } from "configcat-common";
import { HttpConfigFetcher } from "./ConfigFetcher";
import { LocalStorageCache } from "./Cache";

/** Create an instance of ConfigCatClient and setup Auto polling with default options.
 * @param {string} sdkKey - SDK Key to access your configuration.
 * @param options - Options for Auto polling
 */
export function createClient(sdkKey: string, options?: IJSAutoPollOptions): IConfigCatClient {

    return createClientWithAutoPoll(sdkKey, options);
}

/**
 * Create an instance of ConfigCatClient and setup Auto polling.
 * @param {string} sdkKey - SDK Key to access your configuration.
 * @param options - Options for Auto polling
 */
export function createClientWithAutoPoll(sdkKey: string, options?: IJSAutoPollOptions): IConfigCatClient {

    return configcatcommon.createClientWithAutoPoll(
        sdkKey,
        { configFetcher: new HttpConfigFetcher(), cache: new LocalStorageCache() },
        options);
}

/**
 * Create an instance of ConfigCatClient and setup Manual polling.
 * @param {string} sdkKey - SDK Key to access your configuration.
 * @param options - Options for Manual polling
 */
export function createClientWithManualPoll(sdkKey: string, options?: IJSManualPollOptions): IConfigCatClient {

    return configcatcommon.createClientWithManualPoll(
        sdkKey,
        { configFetcher: new HttpConfigFetcher(), cache: new LocalStorageCache() },
        options);
}

/**
 * Create an instance of ConfigCatClient and setup Lazy loading.
 * @param {string} sdkKey - SDK Key to access your configuration.
 * @param options - Options for Lazy loading
 */
export function createClientWithLazyLoad(sdkKey: string, options?: IJSLazyLoadingOptions): IConfigCatClient {

    return configcatcommon.createClientWithLazyLoad(
        sdkKey,
        { configFetcher: new HttpConfigFetcher(), cache: new LocalStorageCache() },
        options);
}

export function createConsoleLogger(logLevel: LogLevel): configcatcommon.IConfigCatLogger {
    return configcatcommon.createConsoleLogger(logLevel);
}

export function createFlagOverridesFromMap(map: { [name: string]: any }, behaviour: number): configcatcommon.FlagOverrides {
    return new configcatcommon.FlagOverrides(new configcatcommon.MapOverrideDataSource(map), behaviour);
}

export interface IJSAutoPollOptions extends configcatcommon.IAutoPollOptions {
}

export interface IJSLazyLoadingOptions extends configcatcommon.ILazyLoadingOptions {
}

export interface IJSManualPollOptions extends configcatcommon.IManualPollOptions {
}

export const DataGovernance = {
    /** Select this if your feature flags are published to all global CDN nodes. */
    Global: configcatcommon.DataGovernance.Global,
    /** Select this if your feature flags are published to CDN nodes only in the EU. */
    EuOnly: configcatcommon.DataGovernance.EuOnly
};

export const OverrideBehaviour = {
    /**
     * When evaluating values, the SDK will not use feature flags and settings from the ConfigCat CDN, but it will use
     * all feature flags and settings that are loaded from local-override sources.
     */
    LocalOnly: configcatcommon.OverrideBehaviour.LocalOnly,
    /**
     * When evaluating values, the SDK will use all feature flags and settings that are downloaded from the ConfigCat CDN,
     * plus all feature flags and settings that are loaded from local-override sources. If a feature flag or a setting is
     * defined both in the fetched and the local-override source then the local-override version will take precedence.
     */
    LocalOverRemote: configcatcommon.OverrideBehaviour.LocalOverRemote,
    /**
     * When evaluating values, the SDK will use all feature flags and settings that are downloaded from the ConfigCat CDN,
     * plus all feature flags and settings that are loaded from local-override sources. If a feature flag or a setting is
     * defined both in the fetched and the local-override source then the fetched version will take precedence.
     */
    RemoteOverLocal: configcatcommon.OverrideBehaviour.RemoteOverLocal,
};