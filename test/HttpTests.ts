import axios, { AxiosError } from "axios";
import AxiosMockAdapter, { } from "axios-mock-adapter";
import { assert } from "chai";
import * as configcatClient from "../src/index";
import { LogLevel } from "../src/index";
import { FakeLogger } from "./helpers/fakes";

describe("HTTP tests", () => {
  const sdkKey = "PKDVCLf-Hq-h-kCzMp-L7Q/psuH7BGHoUmdONrzzUOY7A";
  const baseUrl = "https://cdn-global.test.com";

  it("HTTP timeout", async () => {
    const requestTimeoutMs = 1500;

    const axiosMock = new AxiosMockAdapter(axios);

    try {
      axiosMock.onGet().reply(async config => {
        await new Promise<any>(resolve => setTimeout(resolve, requestTimeoutMs));
        throw new AxiosError(`timeout of ${config.timeout}ms exceeded`, "ECONNABORTED", config, {}, void 0);
      });

      const logger = new FakeLogger();

      const client = configcatClient.createClientWithManualPoll(sdkKey, {
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

      assert.isDefined(logger.messages.find(([level, msg]) => level === LogLevel.Error && msg.startsWith("Request timed out.")));
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

      const client = configcatClient.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.messages.find(([level, msg]) => level === LogLevel.Error && msg.startsWith("Double-check your SDK Key")));
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

      const client = configcatClient.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      assert.isDefined(logger.messages.find(([level, msg]) => level === LogLevel.Error && msg.startsWith("Unexpected HTTP response was received:")));
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
        throw new AxiosError(errorMessage, "ECONNABORTED", config, {}, void 0);
      });

      const logger = new FakeLogger();

      const client = configcatClient.createClientWithManualPoll(sdkKey, {
        requestTimeoutMs: 1000,
        baseUrl,
        logger
      });

      await client.forceRefreshAsync();

      const defaultValue = "NOT_CAT";
      assert.strictEqual(defaultValue, await client.getValueAsync("stringDefaultCat", defaultValue));

      console.log(logger.messages);

      assert.isDefined(logger.messages.find(([level, msg]) => level === LogLevel.Error && msg.startsWith("Request failed due to a network or protocol error.")));
    }
    finally {
      axiosMock.restore();
    }
  });
});
