import { IConfigFetcher, ProjectConfig, OptionsBase } from "configcat-common";
import axios, { AxiosRequestConfig } from 'axios';


export class HttpConfigFetcher implements IConfigFetcher {

    fetchLogic(options: OptionsBase, lastProjectConfig: ProjectConfig, callback: (newProjectConfig: ProjectConfig) => void): void {

        const axiosConfig: AxiosRequestConfig = {
            method: 'get',
            timeout: options.requestTimeoutMs,
            url: options.getUrl(),
            headers: {
                'X-ConfigCat-UserAgent': `ConfigCat-JS-SSR/${options.clientVersion}`,
                'If-None-Match': (lastProjectConfig && lastProjectConfig.HttpETag) ? lastProjectConfig.HttpETag : null
            }
        };

        axios(axiosConfig)
            .then(response => {
                const eTag = response.headers.etag as string;
                if (response.status === 200) {
                    callback(new ProjectConfig(new Date().getTime(), JSON.stringify(response.data), eTag));
                } else {
                    options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${response.status} - ${response.statusText}`);
                    options.logger.info("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                    callback(lastProjectConfig);
                }
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 304) {
                        const eTag = error.response.headers.etag as string;
                        callback(new ProjectConfig(new Date().getTime(), JSON.stringify(lastProjectConfig.ConfigJSON), eTag));
                    } else {
                        options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${error.response.status} - ${error.response.statusText}`);
                        options.logger.info("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                        callback(lastProjectConfig);
                    }
                } else if (error.request) {
                    options.logger.error('The request to Configcat was made but no response was received');
                    callback(lastProjectConfig);
                } else {
                    options.logger.error(`Something happened in setting up the request to ConfigCat: ${error.message}`);
                    callback(lastProjectConfig);
                }
            });
    }
}

export default IConfigFetcher;