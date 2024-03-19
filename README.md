# Mobile Buyer App


This project aims to be a reference applications for the buyers registered on the ONDC platform

## Prerequisites

- [Node.js > 12](https://nodejs.org) and npm (Recommended: Use [nvm](https://github.com/nvm-sh/nvm))
- [Watchman](https://facebook.github.io/watchman)
- [Xcode 12](https://developer.apple.com/xcode)
- [Cocoapods 1.10.1](https://cocoapods.org)
- [JDK > 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android Studio and Android SDK](https://developer.android.com/studio)

## Base dependencies

- [@invertase/react-native-apple-authentication](https://www.npmjs.com/package/@invertase/react-native-apple-authentication) to support login with apple on iphones
- [@ptomasroos/react-native-multi-slider](https://www.npmjs.com/package/@ptomasroos/react-native-multi-slider) to select range
- [@react-native-async-storage/async-storage](https://www.npmjs.com/package/@react-native-async-storage/async-storage) for persistent, key-value storage system
- [@react-native-firebase/auth](https://www.npmjs.com/package/@react-native-firebase/auth) to authenticate user
- [@react-native-google-signin/google-signin](https://www.npmjs.com/package/@react-native-google-signin/google-signin)  to support login with google
- [@react-navigation/native](https://www.npmjs.com/package/@react-navigation/native) to support navigation across the app
- [@react-navigation/native-stack](https://www.npmjs.com/package/@react-navigation/native-stack) to support stack navigation
- [@slanglabs/slang-conva-react-native-retail-assistant](https://www.npmjs.com/package/@slanglabs/slang-conva-react-native-retail-assistant) for audio search
- [axios](https://www.npmjs.com/package/axios) to support api requests
- [formik](https://www.npmjs.com/package/formik) to support form validation
- [hyper-sdk-react](https://www.npmjs.com/package/hyper-sdk-react) for justpay payment integration
- [moment](https://www.npmjs.com/package/moment) to support time related operations
- [react-native-config](https://www.npmjs.com/package/react-native-config) to handle different env of application
- [react-native-event-source](https://www.npmjs.com/package/react-native-event-source) to handle SSE
- [react-native-fast-image](https://www.npmjs.com/package/react-native-fast-image) to render images
- [react-native-image-slider-box](https://www.npmjs.com/package/react-native-image-slider-box) to handle image sliding
- [react-native-keyboard-aware-scroll-view](https://www.npmjs.com/package/react-native-keyboard-aware-scroll-view) to handle keyboard events on form
- [react-native-material-dropdown](https://www.npmjs.com/package/react-native-material-dropdown) to show dropdown
- [react-native-material-menu](https://www.npmjs.com/package/react-native-material-menu) to show menu
- [react-native-multi-slider](https://www.npmjs.com/package/react-native-multi-slider) to select range
- [react-native-pager-view](https://www.npmjs.com/package/react-native-pager-view) to implement page swipe
- [react-native-paper](https://www.npmjs.com/package/react-native-paper) to render UI components
- [react-native-raw-bottom-sheet](https://www.npmjs.com/package/react-native-raw-bottom-sheet) to render sheet
- [react-native-safe-area-context](https://www.npmjs.com/package/react-native-safe-area-context) to handle safe area view
- [react-native-screens](https://www.npmjs.com/package/react-native-screens)
- [react-native-select-dropdown](https://www.npmjs.com/package/react-native-select-dropdown)
- [react-native-skeleton-placeholder](https://www.npmjs.com/package/react-native-skeleton-placeholder) to show skeletons
- [react-native-svg](https://www.npmjs.com/package/react-native-svg) to render svg images
- [react-native-svg-transformer](https://www.npmjs.com/package/react-native-svg-transformer) to render svg images
- [react-native-toast-message](https://www.npmjs.com/package/react-native-toast-message) to show toast messages
- [react-native-vector-icons](https://www.npmjs.com/package/react-native-vector-icons) to show icons
- [react-redux](https://www.npmjs.com/package/react-redux) for state management
- [redux](https://www.npmjs.com/package/redux) for state management
- [yup](https://www.npmjs.com/package/yup) for state management
## Usage

#### Use Template button

### Option 1: Using React-Native-Rename

You can start by cloning this repository and using [react-native-rename](https://github.com/junedomingo/react-native-rename). In the current state of this project, it should give you no issues at all, just run the script, delete your node modules and reinstall them and you should be good to go.

Keep in mind that this library can cause trouble if you are renaming a project that uses `Pods` on the iOS side.

After that you should proceed as with any javascript project:

- Go to your project's root folder and run `npm install`.
- If you are using Xcode 12.5 or higher got to /ios and execute `pod install --`repo-update`
- Run `npm run ios` or `npm run android` to start your application!

(Using yarn: `yarn ios` or `yarn android`)

Note: Please read the Setup environments section that is below in this file for more information about the execution scripts.

### Option 2: Copy the structure to your project

If you want to roll on your own and don't want to use this as a template, you can create your project and then copy the `/src` folder (which has all the code of your application) and update your `index.js`.

Keep in mind that if you do this, you'll have to **install and link** all dependencies (as well as adding all the necessary native code for each library that requires it).

## Splash screen customization

To customize the splash screen (logo and background color) use the CLI provided in the [official docs](https://github.com/zoontek/react-native-bootsplash#assets-generation).

## Steps to run the Mobile App

- Install dependency packages using `yarn install` command.

- Generate the SHA1 key for the keystore with command `keytool -list -v -keystore "PATH TO debug.keystore" -alias androiddebugkey -storepass android -keypass android`

- Create firebase project & add Android/IOS app with the help of App's package name (add .dev as suffix for Development environment) & SHA1 key.

- Add Sign-in providers as Google & Email/Password inside Firebase Sign-in method.

- Download the firebase config file generated from firebase console & place it inside android/app. 

- Create files named as: .env.development, .env.production.

- Copy paste sample.config.js files content and assign appropriate values to the keys.

- BASE_URL should be added directly to the apiUtilities.js file.

- Use following commands to run the application in different environments

  - For Development environment run `react-native run-android --variant=devDebug --appIdSuffix=dev`

  - For Production environment run `react-native run-android --variant=prdDebug`

## Setup environments

### Using scripts from console

The template already has scripts to execute the project calling a specific environment defined into the package.json file. Keep in mind that if you are going to create new `envs` you have to define the script to build the project properly.

To define which env you want to use, just keep the structure `yarn [platform]: [environment]`


DEV: `yarn ios` or `yarn android`

STG: `yarn ios:stg` or `yarn android:stg`

Also, you can use npm following the same rule as before: `npm run ios:stg`

Modify the environment variables files in root folder (`.env.development`, `.env.staging`)


#### Android

A map associating builds with env files is already defined in `app/build.gradle` you can modify or add environments if needed.

For multiple enviroments to work you would need to change `-keep class [YOUR_PACKAGE_NAME].BuildConfig { *; }` on `proguard-rules.pro` file.

#### iOS

The basic idea in iOS is to have one scheme per environment file, so you can easily alternate between them.

To create a new scheme:

- In the Xcode menu, go to Product > Scheme > Edit Scheme
- Click Duplicate Scheme on the bottom
- Give it a proper name on the top left. For instance: "qa"
- Then edit the newly created scheme to make it use a different env file. From the same "manage scheme" window:

  Expand the "Build" tab on the left menu
  - Click "Pre-actions", and under the plus sign select "New Run Script Action"
  - Where it says "Type a script or drag a script file", type: `echo ".env.qa" > /tmp/envfile` replacing `.env.qa` with your file.
- Also, you will need to select the executable for the new schema:

  Expand the "Run" tab on the left menu
  - Under the "Executable" dropdown select the ".app" you would like to use for that schema

## Generate production version

These are the steps to generate `.apk`, `.aab` and `.ipa` files

### Android

1. Generate an upload key
2. Setting up gradle variables
3. Go to the android folder
4. Execute `./gradlew assemble[Env][BuildType]`

Note: You have three options to execute the project
`assemble:` Generates an apk that you can share with others.
`install:` When you want to test a release build on a connected device.
`bundle:` When you are uploading the app to the Play Store.

For more info please go to https://reactnative.dev/docs/signed-apk-android

### iOS

1. Go to the Xcode
2. Select the schema
3. Select 'Any iOS device' as target
4. Product -> Archive

For more info please go to https://reactnative.dev/docs/publishing-to-app-store
