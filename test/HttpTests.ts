import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AxiosMockAdapter, { } from "axios-mock-adapter";
import { assert } from "chai";
import { LogLevel } from "../src/index";
import { FakeLogger } from "./helpers/fakes";
import * as utils from "./helpers/utils";

describe("HTTP tests", () => {
  const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";
  const baseUrl = "https://cdn-global.test.com";

  it("HTTP timeout", async () => {
    const requestTimeoutMs = 1500;

    const axiosMock = new AxiosMockAdapter(axios);

    try {
      axiosMock.onGet().reply(async config => {
        await new Promise<any>(resolve => setTimeout(resolve, requestTimeoutMs));
        throw new AxiosError(`timeout of ${config.timeout}ms exceeded`, "ECONNABORTED", config as InternalAxiosRequestConfig, {}, void 0);
      });

      const logger = new FakeLogger();

      const client = utils.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs,
        baseUrl,
        logger
      });
      const startTime = new Date().getTime();
      await client.forceRefreshAsync();
      const duration = new Date().getTime() - startTime;
      assert.isTrue(duration > 1000 && duration < 2000);

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.events.find(([level, , msg]) => level === LogLevel.Error && msg.toString().startsWith("Request timed out while trying to fetch config JSON.")));
    }
    finally {
      axiosMock.restore();
    }
  });

  it("404 Not found", async () => {
    const axiosMock = new AxiosMockAdapter(axios);

    try {
      axiosMock.onGet().reply(() => {
        return [404, "Not Found"];
      });

      const logger = new FakeLogger();

      const client = utils.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.events.find(([level, , msg]) => level === LogLevel.Error && msg.toString().startsWith("Your SDK Key seems to be wrong:")));
    }
    finally {
      axiosMock.restore();
    }
  });

  it("Unexpected status code", async () => {
    const axiosMock = new AxiosMockAdapter(axios);

    try {
      axiosMock.onGet().reply(() => {
        return [502, "Bad Gateway"];
      });

      const logger = new FakeLogger();

      const client = utils.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.events.find(([level, , msg]) => level === LogLevel.Error && msg.toString().startsWith("Unexpected HTTP response was received while trying to fetch config JSON:")));
    }
    finally {
      axiosMock.restore();
    }
  });

  it("Unexpected error", async () => {
    const errorMessage = "Something went wrong";

    const axiosMock = new AxiosMockAdapter(axios);

    try {
      axiosMock.onGet().reply(config => {
        throw new AxiosError(errorMessage, "ECONNABORTED", config as InternalAxiosRequestConfig, {}, void 0);
      });

      const logger = new FakeLogger();

      const client = utils.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.events.find(([level, , msg]) => level === LogLevel.Error && msg.toString().startsWith("Unexpected error occurred while trying to fetch config JSON.")));
    }
    finally {
      axiosMock.restore();
    }
  });
});
