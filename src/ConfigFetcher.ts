import { IConfigFetcher, ProjectConfig, OptionsBase, FetchResult } from "configcat-common";
import axios, { AxiosRequestConfig } from 'axios';


export class HttpConfigFetcher implements IConfigFetcher {

    fetchLogic(options: OptionsBase, lastEtag: string, callback: (result: FetchResult) => void): void {

        const axiosConfig: AxiosRequestConfig = {
            method: 'get',
            timeout: options.requestTimeoutMs,
            url: options.getUrl(),
            headers: {
                'X-ConfigCat-UserAgent': options.clientVersion,
                'If-None-Match': (lastEtag) ? lastEtag : null
            }
        };

        axios(axiosConfig)
            .then(response => {
                const eTag = response.headers.etag as string;
                if (response.status === 200) {
                    callback(FetchResult.success(JSON.stringify(response.data), eTag));
                } else {
                    options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${response.status} - ${response.statusText}`);
                    options.logger.info("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                    callback(FetchResult.error());
                }
            })
            .catch(error => {
                if (error.response) {
                    if (error.response.status === 304) {
                        callback(FetchResult.notModified());
                    } else {
                        options.logger.error(`Failed to download feature flags & settings from ConfigCat. ${error.response.status} - ${error.response.statusText}`);
                        options.logger.info("Double-check your SDK Key on https://app.configcat.com/sdkkey");
                        callback(FetchResult.error());
                    }
                } else if (error.request) {
                    options.logger.error('The request to Configcat was made but no response was received');
                    callback(FetchResult.error());
                } else {
                    options.logger.error(`Something happened in setting up the request to ConfigCat: ${error.message}`);
                    callback(FetchResult.error());
                }
            });
    }
}

export default IConfigFetcher;