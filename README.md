# ninefour r3f template
this site is built using an internal react-three-fiber template built by ninefour
as such this README is mainly for self reference or in the event that someone else ends up using it or reading my code

## asset map
to handle load screen progress an asset map is generated on build from all files in the `/public/assets` directory

***do not have unused files in the assets directory or else loading will be forever stuck***
as it will expect to load more assets than you actually do

for files not handled via the defaultLoadingManager of three.js dispatch an `'assetLoad'` event once the asset is finished loading with the url of the file as the detail of the event

## scroll handler
scrolling is handled manually to allow for interactivity with the webgl canvas while maintaing the ability scroll
to access the scroll position use the `useScroll` hook which provides a ref to the current scroll position
the scroll position is expressed as an integer which each whole number representing the top of the next "page"

## deployment
deployment is done via github pages using the gh-pages package

to deploy a site:
1. add the A record pointing the apex domain to IP addresses of Github pages if not already there
2. set the domain of `hompage` and `scripts.deploy` in `package.json`
3. run the deploy script using `npm run deploy`
4. go to the settings of the repo and in the pages tab and set the custom domain
5. add a CNAME record for the host name to `dawsinb.github.io.`