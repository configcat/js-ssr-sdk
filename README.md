| :mega: Important notice |
|-------------------------|
| This SDK is superseded by the [new, unified ConfigCat SDK for JavaScript](https://github.com/configcat/js-unified-sdk#configcat-sdk-for-javascript).<br/>This legacy SDK is in maintenance mode now, it will receive only critical security patches until **official support ends on August 31, 2026**.<br/> We recommend migrating to the new SDK as described [here](https://configcat.com/docs/sdk-reference/js-ssr/#migration-to-the-new-sdk). |

# ConfigCat SDK for JavaScript Server Side Rendered applications
https://configcat.com

ConfigCat SDK for Server Side Rendered apps provides easy integration with ConfigCat feature flags.

ConfigCat is a feature flag and configuration management service that lets you separate releases from deployments. You can turn your features ON/OFF using <a href="https://app.configcat.com" target="_blank">ConfigCat Dashboard</a> even after they are deployed. ConfigCat lets you target specific groups of users based on region, email or any other custom user attribute.

ConfigCat is a <a href="https://configcat.com" target="_blank">hosted feature flag service</a>. Manage feature toggles across frontend, backend, mobile, desktop apps. <a href="https://configcat.com" target="_blank">Alternative to LaunchDarkly</a>. Management app + feature flag SDKs.

[![JS-SSR CI](https://github.com/configcat/js-ssr-sdk/actions/workflows/js-ssr-ci.yml/badge.svg?branch=master)](https://github.com/configcat/js-ssr-sdk/actions/workflows/js-ssr-ci.yml) 
[![codecov](https://codecov.io/gh/configcat/js-ssr-sdk/branch/master/graph/badge.svg)](https://codecov.io/gh/configcat/js-ssr-sdk) 
[![Known Vulnerabilities](https://snyk.io/test/github/configcat/js-ssr-sdk/badge.svg?targetFile=package.json)](https://snyk.io/test/github/configcat/js-ssr-sdk?targetFile=package.json) 
![License](https://img.shields.io/github/license/configcat/js-ssr-sdk.svg) 
[![](https://data.jsdelivr.com/v1/package/npm/configcat-js-ssr/badge)](https://www.jsdelivr.com/package/npm/configcat-js-ssr)
[![NPM](https://nodei.co/npm/configcat-js-ssr.png)](https://nodei.co/npm/configcat-js-ssr/)

## Getting Started

### 1. Install and import package:

*via NPM [package](https://npmjs.com/package/configcat-js-ssr):*
```PowerShell
npm i configcat-js-ssr
```
```js
import * as configcat from "configcat-js-ssr";
```

### 2. Go to the <a href="https://app.configcat.com/sdkkey" target="_blank">ConfigCat Dashboard</a> to get your *SDK Key*:
![SDK-KEY](https://raw.githubusercontent.com/ConfigCat/js-ssr-sdk/master/media/readme02-3.png  "SDK-KEY")

### 3. Create a *ConfigCat* client instance:
```js
const configCatClient = configcat.getClient("#YOUR-SDK-KEY#");
```

> You can acquire singleton client instances for your SDK keys using the `getClient("<sdkKey>")` factory function.
(However, please keep in mind that subsequent calls to `getClient()` with the *same SDK Key* return a *shared* client instance, which was set up by the first call.)

### 4. Get your setting value:
The async/await way:
```js
const value = await configCatClient.getValueAsync('isMyAwesomeFeatureEnabled', false);

if (value) {
  do_the_new_thing();
} else {
  do_the_old_thing();
}
```
or the Promise way:
```js
configCatClient.getValueAsync('isMyAwesomeFeatureEnabled', false)
  .then((value) => {
    if (value) {
      do_the_new_thing();
    } else {
      do_the_old_thing();
    }
  });
```

## Getting user specific setting values with Targeting
Using this feature, you will be able to get different setting values for different users in your application by passing a `User Object` to `getValue()` or `getValueAsync()`.

Read more about [Targeting here](https://configcat.com/docs/advanced/targeting/).
```js
const userObject = new configcat.User("#USER-IDENTIFIER#");
const value = await configCatClient.getValueAsync('isMyAwesomeFeatureEnabled', false, userObject);

if (value) {
  do_the_new_thing();
} else {
  do_the_old_thing();
}
```

## Sample/Demo apps
  - [NuxtJS](https://github.com/configcat/js-ssr-sdk/tree/master/samples/nuxt-ssr)

## Polling Modes
The ConfigCat SDK supports 3 different polling mechanisms to acquire the setting values from ConfigCat. After latest setting values are downloaded, they are stored in the internal cache then all requests are served from there. Read more about Polling Modes and how to use them at [ConfigCat Docs](https://configcat.com/docs/sdk-reference/js-ssr).

## Sensitive information handling

The frontend/mobile SDKs are running in your users' browsers/devices. The SDK is downloading a [config.json](https://configcat.com/docs/requests/) file from ConfigCat's CDN servers. The URL path for this config.json file contains your SDK key, so the SDK key and the content of your config.json file (feature flag keys, feature flag values, targeting rules, % rules) can be visible to your users. 
This SDK key is read-only, it only allows downloading your config.json file, but nobody can make any changes with it in your ConfigCat account.  
Suppose you don't want your SDK key or the content of your config.json file visible to your users. In that case, we recommend you use the SDK only in your backend applications and call a backend endpoint in your frontend/mobile application to evaluate the feature flags for a specific application customer.  
Also, we recommend using [sensitive targeting comparators](https://configcat.com/docs/advanced/targeting/#sensitive-text-comparators) in the targeting rules of those feature flags that are used in the frontend/mobile SDKs.

## Browser compatibility
This SDK should be compatible with all modern browsers.

The SDK is [tested](https://github.com/configcat/js-ssr-sdk/blob/master/.github/workflows/js-ssr-ci.yml) against the following browsers:
- Chrome (stable, latest, beta)
- Chromium (64.0.3282.0, 72.0.3626.0, 80.0.3987.0)
- Firefox (latest, latest-beta, 84.0).

These tests are running on each pull request, before each deploy, and on a daily basis. 
You can view a sample run [here](https://github.com/configcat/js-ssr-sdk/actions/runs/2420724478).

## Need help?
https://configcat.com/support

## Contributing
Contributions are welcome.

## About ConfigCat
- [Official ConfigCat SDK's for other platforms](https://github.com/configcat)
- [Documentation](https://configcat.com/docs)
- [Blog](https://blog.configcat.com)

# Troubleshooting
### Make sure you have the proper Node.js version installed
You might run into errors caused by the wrong version of Node.js. To make sure you are using the recommended Node.js version follow these steps.

1. Have nvm (Node Version Manager - https://github.com/nvm-sh/nvm ) installed:
1. Run `nvm install`. This will install the compatible version of Node.js.
1. Run `nvm use`. This will use the compatible version of Node.js.