import { ICache } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfig";

export class LocalStorageCache implements ICache {
    cache:  { [sdkKey: string] : ProjectConfig; } = {};

    Set(sdkKey: string, config: ProjectConfig): void {
        this.cache[sdkKey] = config;

        try {
            localStorage.setItem(this.getLocalStorageKey(sdkKey), btoa(JSON.stringify(config)));
        } catch (ex) {
            // local storage is unavailable
        }
    }

    Get(sdkKey: string): ProjectConfig {
        let config = this.cache[sdkKey];
        if (config) {
            return config;
        }

        try {
            let configString = localStorage.getItem(this.getLocalStorageKey(sdkKey));
            if (configString) {
                let config = JSON.parse(atob(configString));
                if (config) {
                    this.cache[sdkKey] = config;
                    return config;
                }
            }
        } catch (ex) {
            // local storage is unavailable or invalid cache value in localstorage
        }

        return null;
    }

    private getLocalStorageKey(sdkKey: string): string{
        return "ConfigCat_v4" + sdkKey;
    }
}