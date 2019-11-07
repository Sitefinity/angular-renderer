Progress® Sitefinity® CMS sample frontend renderer app
======================================================

> **NOTE**: Latest supported version: Sitefinity CMS 12.2.7200.0

## Overview

The sample code in this repo implements a decoupled frontend SPA renderer for Sitefinity CMS. It uses the Sitefinity Layout API services to render the layout and widget content in Sitefinity MVC pages. This implementation also works with personalized pages and personalized widgets to enable per-user content personalization.

## Prerequisites
- Node.js 12.0 LTS or later.
- npm 6.0 or later.

## Installation

To develop using the provided source sample, perform the following:
1. Clone this repository.
2. Using a text editor, open this file: `<local repository>/src/app/services/root-url.service`
3. Locate the `getUrl` method.
4. Change the value it returns to be the URL of your Sitefinity CMS instance containing the data you want to expose.
5. Open a new Command Prompt inside the directory with your local repository.
6. To install project dependencies, run `npm install`.
7. To start the sample application, run `npm start`.

    The application starts listening on localhost:4200.
8. To verify that the sample application works, perform the following:
    1. Log into your Sitefinity CMS instance with administrative credentials.
    2. Click Pages.
    3. In the Actions menu of the page that you want to render, click Title & properties.
    4. Copy the last segment of the page’s URL.
   
       For example, `welcome`.
    5. In your browser, enter `localhost:4200/<URL of the page to render>`

       For example, enter `localhost:4200/welcome`.
