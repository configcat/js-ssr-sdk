<template>
  <div class="container">
    <div>
      <logo />
      <h2 class="subtitle">ConfigCat NuxtJS Sample App</h2>
      <div>
        <button v-on:click="checkAwesome" class="button--green">Check Awesome Feature</button>
        <p>{{isAwesomeFeatureEnabled}}</p>
      </div>
      <div>
        <button v-on:click="checkPOC" class="button--grey">Check POC Feature</button>
        <p>{{isPOCFeatureEnabled}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Logo from "~/components/Logo.vue";
import * as ConfiCat from "configcat-js-ssr";

const client = ConfiCat.createClientWithAutoPoll(
  "7ZTVCKnUJprikI6Rwlj0RA/eJ8H21HZA06fDJrnzWyvGA",
  { pollIntervalSeconds: 5 }
);
const value = false;

export default Vue.extend({
  components: {
    Logo
  },
  data: () => {
    return {
      isAwesomeFeatureEnabled: false,
      isPOCFeatureEnabled: false
    };
  },
  methods: {
    checkAwesome () {
      client.getValue("isAwesomeFeatureEnabled", false, value => {
        this.isAwesomeFeatureEnabled = value
      });
    },
    checkPOC () {
      client.getValue("isPOCFeatureEnabled", false, value => {
        this.isPOCFeatureEnabled = value
      });
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
