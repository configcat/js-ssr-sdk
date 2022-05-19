import { assert } from "chai";
import "mocha";
import * as configcatClient from "../src/index";
import { IConfigCatClient, FlagOverrides } from "configcat-common";

describe("ConfigCatClient index (main)", () => {

    it("createClient ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClient("SDKKEY");

        assert.isDefined(client);
    });

    it("createClientWithAutoPoll ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithAutoPoll("SDKKEY", { "pollIntervalSeconds": 15 });
        assert.isDefined(client);
    });

    it("createClientWithLazyLoad ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithLazyLoad("SDKKEY", { "cacheTimeToLiveSeconds": 15 });

        assert.isDefined(client);
    });

    it("createClientWithManualPoll ShouldCreateInstance", () => {

        var client: IConfigCatClient = configcatClient.createClientWithManualPoll("SDKKEY");

        assert.isDefined(client);
    });

    it("createFlagOverridesFromMap ShouldCreateFlagOverrides", () => {
        const overrides: FlagOverrides = configcatClient.createFlagOverridesFromMap({ test: true }, configcatClient.OverrideBehaviour.LocalOnly);

        assert.isDefined(overrides);
    });
});