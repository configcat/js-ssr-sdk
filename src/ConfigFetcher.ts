import type { AxiosError, AxiosRequestConfig, AxiosResponse, RawAxiosRequestHeaders } from "axios";
import axios from "axios";
import type { IConfigFetcher, IFetchResponse, OptionsBase } from "configcat-common";
import { FetchError } from "configcat-common";

export class HttpConfigFetcher implements IConfigFetcher {
  async fetchLogic(options: OptionsBase, lastEtag: string | null): Promise<IFetchResponse> {
    let url = options.getUrl();
    let headers: RawAxiosRequestHeaders | undefined;
    if (lastEtag) {
      if (typeof window !== "undefined") {
        // NOTE: If we are running in browser, it's intentional that we don't specify the If-None-Match header.
        // The browser automatically handles it, adding it manually would cause an unnecessary CORS OPTIONS request.
        // In case the browser doesn't handle it, we are transforming the ccetag query parameter to the If-None-Match header in our CDN provider.
        url += "&ccetag=" + lastEtag;
      }
      else {
        headers = { "If-None-Match": lastEtag };
      }
    }

    const axiosConfig: AxiosRequestConfig<string> = {
      method: "get",
      timeout: options.requestTimeoutMs,
      url,
      headers,
      responseType: "text",
      transformResponse: data => data
    };

    let response: AxiosResponse<string> | undefined;
    try {
      response = await axios(axiosConfig);
    }
    catch (err) {
      ({ response } = err as AxiosError<string>);
      if (response) {
        const { status: statusCode, statusText: reasonPhrase } = response;
        return { statusCode, reasonPhrase };
      }
      else if ((err as AxiosError<string>).request) {
        const { code, message } = err as AxiosError<string>;
        switch (code) {
          case "ERR_CANCELED":
            throw new FetchError("abort");
          case "ECONNABORTED":
            // Axios ambiguously use ECONNABORTED instead of ETIMEDOUT, so we need this additional check to detect timeout
            // (see https://github.com/axios/axios/issues/1543#issuecomment-558166483)
            if (message.indexOf("timeout") >= 0) {
              throw new FetchError("timeout", options.requestTimeoutMs);
            }
            break;
          default:
            break;
        }
        throw new FetchError("failure", err);
      }

      throw err;
    }

    const { status: statusCode, statusText: reasonPhrase } = response!;
    if (statusCode === 200) {
      const eTag = response!.headers.etag as string;
      return { statusCode, reasonPhrase, eTag, body: response!.data };
    }

    return { statusCode, reasonPhrase };
  }
}
