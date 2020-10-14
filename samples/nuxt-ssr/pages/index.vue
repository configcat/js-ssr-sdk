<template>
  <div class="container">
    <div>
      <logo />
      <h2 class="subtitle">ConfigCat NuxtJS Sample App</h2>
      <div>
        <button v-on:click="checkAwesome" class="button--green">Check Awesome Feature</button>
        <p>{{isAwesomeFeatureEnabled}}</p>
      </div>
      <div class="poc">
        <label for="user">Sample user:</label>
        <input type="text" ref="user" name="user" v-model="user">
        <button v-on:click="checkPOC" class="button--grey">Check POC Feature</button>
        <p>{{isPOCFeatureEnabled}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Logo from "~/components/Logo.vue";
import * as ConfigCat from "configcat-js-ssr";
import { log } from "util";

// Setting log level to 3 (= Info) to show detailed feature flag evaluation
const logger = ConfigCat.createConsoleLogger(3);

// You can instantiate the client with different polling modes. See the Docs: https://configcat.com/docs/sdk-reference/js-ssr/#polling-modes
const client = ConfigCat.createClientWithAutoPoll(
  "PKDVCLf-Hq-h-kCzMp-L7Q/HhOWfwVtZ0mb30i9wi17GQ",
  { pollIntervalSeconds: 5, logger: logger }
);

const value = false;

export default Vue.extend({
  components: {
    Logo
  },
  data: () => {
    return {
      isAwesomeFeatureEnabled: false,
      isPOCFeatureEnabled: false,
      user: 'configcat@example.com'
    };
  },
  methods: {
    checkAwesome() {
      client.getValue("isAwesomeFeatureEnabled", false, value => {
        this.isAwesomeFeatureEnabled = value;
      });
    },
    checkPOC() {
      // Read more about the User Object: https://configcat.com/docs/sdk-reference/node/#user-object
      const userObject = {
        identifier: "#SOME-USER-ID#",
        email: this.user
      };      
      client.getValue(
        "isPOCFeatureEnabled",
        false,
        value => {
          this.isPOCFeatureEnabled = value;
        },
        userObject
      );
    }
  }
});
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.poc {
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poc input {
  margin-bottom: .5rem;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
