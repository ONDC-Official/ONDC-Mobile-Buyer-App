# ONDC Saarthi


This project aims to be a reference applications for the buyers registered on the ONDC platform

# User Manual

 A detailed user manual for the ONDC Saarthi app is available [here](https://docs.google.com/document/d/1ICRM0BwlyBUPlH2WOT4WcochudtFGiGZKCUk_n4XtvQ/edit?tab=t.0)

 # App Features

Have a look at the features enabled on Saarthi

[Saarthi Teaser](https://drive.google.com/file/d/1CUex5gD-OsHZ50CgcOT7N84pYslXKAX5/view?usp=drive_link)

[Saarthi Demo](https://drive.google.com/file/d/19sjiNVOYrdHKGIDutUn7-vWy4rYuZ4Yi/view?usp=drive_link)

## Prerequisites

- [Node.js > 12](https://nodejs.org) and npm (Recommended: Use [nvm](https://github.com/nvm-sh/nvm))
- [Watchman](https://facebook.github.io/watchman)
- [Xcode 12](https://developer.apple.com/xcode)
- [Cocoapods 1.10.1](https://cocoapods.org)
- [JDK > 11](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html)
- [Android Studio and Android SDK](https://developer.android.com/studio)

## Usage

#### Use Template button

### Option 1: Using React-Native-Rename

You can start by cloning this repository and using [react-native-rename](https://github.com/junedomingo/react-native-rename) your rename the app and package name. In the current state of this project, it should give you no issues at all, just run the script, delete your node modules and reinstall them and you should be good to go.

Keep in mind that this library can cause trouble if you are renaming a project that uses `Pods` on the iOS side.

After that you should proceed as with any javascript project:

- Go to your project's root folder and run `npm install --legacy-peer-deps`.
- If you are using Xcode 12.5 or higher got to /ios and execute `pod install --repo-update`

Note: Please read the Setup environments section that is below in this file for more information about the execution scripts.

### Option 2: Copy the structure to your project

If you want to roll on your own and don't want to use this as a template, you can create your project and then copy the `/src` folder (which has all the code of your application) and update your `index.js`.

Keep in mind that if you do this, you'll have to **install and link** all dependencies (as well as adding all the necessary native code for each library that requires it).

## Setup environments

### Setup Instructions

#### 1. Environment Variables

This project uses environment variables to manage configuration settings. The environment variables should be stored in a `.env.development, .env.staging, .env.preprod, .env.production` file in the root of the project.

#### 1.1. Creating the env files

1. In the root directory of your project, create a env files named as `.env.development, .env.staging, .env.preprod, .env.production`.
2. Copy the content from the provided `.env.example` file and paste it into your env files.
3. Replace the placeholder values with your actual configuration settings.

#### 1.2. Add firebase configs in for different platforms

##### iOS Platform
1. Create a folder named `Firebase` under `ios/[app_folder]`.
2. Inside the Firebase folder, create four folders named `Staging`, `Development`, `Preprod`, and `Production`.
3. In each of these folders, add the corresponding `GoogleService-Info.plist` files downloaded from Firebase.

##### Android Platform
1. Inside the `android/app` folder, create four folders named `staging`, `development`, `preprod`, and `production`.
2. In each of these folders, add the corresponding `google-services.json` files downloaded from Firebase.

### Using scripts from console

The template already has scripts to execute the project calling a specific environment defined into the package.json file. Keep in mind that if you are going to create new `envs` you have to define the script to build the project properly.

To define which env you want to use, just keep the structure 
`npm run [platform]: [environment]`

Development: `npm run ios:development` or `npm run android:development`

Staging: `npm run ios:staging` or `npm run android:staging`

Preprod: `npm run ios:preprod` or `npm run android:preprod`

Prod: `npm run ios:prod` or `npm run android:prod`

Modify the environment variables files in root folder (`.env.development`, `.env.staging`, `.env.preprod`, `.env.production`)


#### Android

A map associating builds with env files is already defined in `app/build.gradle` you can modify or add environments if needed.

For multiple environments to work you would need to change `-keep class [YOUR_PACKAGE_NAME].BuildConfig { *; }` on `proguard-rules.pro` file.

#### iOS

The basic idea in iOS is to have one scheme per environment file, so you can easily alternate between them.

To create a new scheme:

- In the Xcode menu, go to Product > Scheme > Edit Scheme
- Click Duplicate Scheme on the bottom
- Give it a proper name on the top left. For instance: "development"
- Then edit the newly created scheme to make it use a different env file. From the same "manage scheme" window:

  Expand the "Build" tab on the left menu
  - Click "Pre-actions", and under the plus sign select "New Run Script Action"
  - Where it says "Type a script or drag a script file", type: `echo ".env.development" > /tmp/envfile` replacing `.env.development` with your file.
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
