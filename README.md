# Single Bundle Configuration for Create React App

This guide details the process of configuring a Create React App (CRA) based project to generate a single JavaScript file and inline all CSS and JavaScript directly into the `index.html`. This is particularly useful when the application needs to be embedded in environments that do not support multiple file references, such as certain mobile application frameworks.

## Background

By default, CRA splits the application code into various chunks to optimize load performance. However, this default behavior can be altered to bundle the entire application code into a single file. Additionally, Gulp is used to inline all the assets into `index.html`, creating a self-contained application.

## Steps

The configuration involves two main steps:

1. **Disabling Code Splitting in CRA.**
2. **Inlining all assets into `index.html` using Gulp.**

### Disabling Code Splitting

To prevent CRA from splitting the code into chunks, we use `react-app-rewired` along with `customize-cra`. These allow us to modify the internal webpack configuration without ejecting.

1. Install `react-app-rewired` and `customize-cra`:

   ```bash
   npm install react-app-rewired customize-cra --save-dev
   ```

2. Create a `config-overrides.js` file in the root directory with the following content:

   ```javascript
   // config-overrides.js
   const { override } = require("customize-cra");

   module.exports = override((config) => {
     config.optimization.splitChunks = {
       cacheGroups: {
         default: false,
       },
     };
     config.optimization.runtimeChunk = false;
     return config;
   });
   ```

### Inlining Assets with Gulp

Gulp automates the inlining of CSS and JS into `index.html`.

1. Install Gulp and related plugins:

   ```bash
   npm install gulp gulp-inline-source gulp-replace gulp-cheerio --save-dev
   ```

2. Set up the `gulpfile.js`:

   ```javascript
   // gulpfile.js
   const gulp = require("gulp");
   const inlineSource = require("gulp-inline-source");
   const replace = require("gulp-replace");
   const cheerio = require("gulp-cheerio");

   gulp.task("default", () => {
     return gulp
       .src("./build/*.html")
       .pipe(
         cheerio(($) => {
           const scriptTag = $("script[defer]");
           $("body").append(scriptTag);
         })
       )
       .pipe(replace('.js"></script>', '.js" inline></script>'))
       .pipe(replace('rel="stylesheet">', 'rel="stylesheet" inline>'))
       .pipe(
         inlineSource({
           compress: false,
           ignore: ["png"],
         })
       )
       .pipe(gulp.dest("./build"));
   });
   ```

### Environment Variables

Use a `.env` file to set environment variables for the build process:

```plaintext
INLINE_RUNTIME_CHUNK=false
GENERATE_SOURCEMAP=false
SKIP_PREFLIGHT_CHECK=true
```

### Modifying package.json

Update the package.json to use react-app-rewired:

```json
"scripts": {
  "start": "react-app-rewired start",
  "build": "react-app-rewired build",
  "test": "react-app-rewired test",
  "eject": "react-scripts eject"
},
```

_Note_: Ensure that you remove any code that forces chunks, such as the following, from your application:

```javascript
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
```

### Running the Build

After setting up, run the build command to generate the single bundle and inline assets:

```bash
npm run build
gulp
```

The build script will create a production build with a single JavaScript file, and the gulp command will inline all resources into the `index.html`

### Conclusion

Following this configuration allows you to package a CRA application into a single `index.html` file with all assets inlined, suitable for use cases that require a standalone file for the entire application. It is recommended to thoroughly test the application after these modifications to ensure functionality remains intact.
