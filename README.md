Progress® Sitefinity® CMS sample frontend renderer app
======================================================

> **NOTE**: Latest supported version: Sitefinity CMS 13.1.7400.0

## Overview

The sample code in this repo implements a decoupled frontend SPA renderer for Sitefinity CMS. It uses the Sitefinity Layout API services to render the layout and widget content in Sitefinity MVC pages. This implementation also works with personalized pages and personalized widgets to enable per-user content personalization. The sample code uses the Angular framework.

In this repository, you can find these sample apps:

1. The `master` branch contains a blank starter kit. 

   Use it when you want to have full control over the functionality of your app.
2. The `quantum-landing-page` branch contains a sample app which demonstrates how to consume and present content and layout.
   Use it to learn how to build an Angular based frontend app. To run this app, you need to set up an instance of the [Sitefinity Quantum](https://github.com/Sitefinity/Telerik.Sitefinity.Samples.Quantum) sample project.

## Prerequisites
- Node.js 12.0 LTS or later.
- npm 6.0 or later.

## Installation

To develop using the provided source sample, perform the following:
1. Clone this repository.
2. To use the sample app, use your Git client to switch to the `quantum-landing-page` branch.
3. Using a text editor, open this file: `<local repository>/src/app/services/root-url.service`
4. Locate the `getUrl` method.
5. Change the value it returns to be the URL of your Sitefinity CMS instance containing the data you want to expose.
6. Open a new Command Prompt inside the directory with your local repository.
7. To install project dependencies, run `npm install`.
8. To start the sample application, run `npm start`.

    The application starts listening on localhost:4200.
9. To verify that the sample application works, perform the following:
    1. Log into your Sitefinity CMS instance with administrative credentials.
    2. Click Pages.
    3. In the Actions menu of the page that you want to render, click Title & properties.
    4. Copy the last segment of the page’s URL.
   
       For example, `welcome`.
    5. In your browser, enter `localhost:4200/<URL of the page to render>`

       For example, enter `localhost:4200/welcome`.
