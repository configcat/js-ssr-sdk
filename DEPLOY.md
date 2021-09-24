# How to deploy

## Before deployment

Make sure the CI is running: https://github.com/configcat/js-ssr-sdk/actions/workflows/js-ssr-ci.yml

## Via shell script

1. Run `./deploy.sh`

1. Make sure new package is available via NPM: https://www.npmjs.com/package/configcat-js-ssr

1. Add release notes: https://github.com/configcat/nuxt-sdk/releases

2. Update `configcat-js-ssr` dependency in all sample applications:
   And test them by following their `README.md`.

or

## Manually

2. Run tests
   ```bash
    npm test
    ```

3. Create a new version (patch, minor, major)
Increase version number by using `npm version patch | minor | major`

    *Example: increasing patch version* 
    ```bash
    npm version patch
    ```
1. Push tag to remote
    
    If you tag the commit, a GitHub action automatically publishes the package to NPM. 
    ```bash
    git push origin <new version>
    ```
    *Example: git push origin v1.1.17*

    You can follow the build status here -> https://github.com/configcat/js-ssr-sdk/actions/workflows/js-ssr-ci.yml

1. Make sure new package is available via NPM: https://www.npmjs.com/package/configcat-js-ssr

1. Add release notes: https://github.com/configcat/js-ssr-sdk/releases

2. Update `configcat-js-ssr` dependency in all sample applications:
   And test them by following their `README.md`.