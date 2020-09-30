import { ICache } from "configcat-common";
import { ProjectConfig } from "configcat-common/lib/ProjectConfig";

export class LocalStorageCache implements ICache {
    cache:  { [key: string] : ProjectConfig; } = {};

    set(key: string, config: ProjectConfig): void {
        this.cache[key] = config;

        try {
            localStorage.setItem(key, btoa(JSON.stringify(config)));
        } catch (ex) {
            // local storage is unavailable
        }
    }

    get(key: string): ProjectConfig {
        let config = this.cache[key];
        if (config) {
            return config;
        }

        try {
            let configString = localStorage.getItem(key);
            if (configString) {
                let config = JSON.parse(atob(configString));
                if (config) {
                    this.cache[key] = config;
                    return config;
                }
            }
        } catch (ex) {
            // local storage is unavailable or invalid cache value in localstorage
        }

        return null;
    }
}