# Official @wthek Extension – Restify Middleware for `http-error-kit`

**Seamless Restify Error Handling with @wthek**

_Built for applications powered by [http-error-kit][http-error-kit], this middleware ensures that all `http-error-kit` errors are properly formatted and returned with the correct HTTP status codes._

> 💡 What the HEK?! Need a hassle-free way to manage error responses for `http-error-kit` errors in Restify? `@wthek/restify-middleware` has got you covered!

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/skillnter/wthek-restify-middleware/main.yml)
[![npm version](https://img.shields.io/npm/v/%40wthek%2Frestify-middleware?color=brightgreen)](https://www.npmjs.com/package/@wthek/restify-middleware)
[![GitHub license](https://img.shields.io/github/license/skillnter/wthek-restify-middleware?color=brightgreen)](LICENSE)
[![GitHub Issues](https://img.shields.io/github/issues/Skillnter/wthek-restify-middleware)](https://github.com/Skillnter/wthek-restify-middleware/issues)
[![Codacy Badge](https://app.codacy.com/project/badge/Coverage/f672583cdb534cfd8eb16b71249ba35c)](https://app.codacy.com/gh/Skillnter/wthek-restify-middleware/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_coverage)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/f672583cdb534cfd8eb16b71249ba35c)](https://app.codacy.com/gh/Skillnter/wthek-restify-middleware/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
![npms.io (final)](https://img.shields.io/npms-io/maintenance-score/%40wthek%2Frestify-middleware?color=brightgreen)
![npm](https://img.shields.io/npm/dy/%40wthek%2Frestify-middleware)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@wthek/restify-middleware/1.0.0)](https://socket.dev/npm/package/@wthek/restify-middleware/overview/1.0.0)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?logo=github&logoColor=white)](https://skillnter.github.io/wthek-restify-middleware/)
[![Github Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-30363D?&logo=GitHub-Sponsors&logoColor=EA4AAA)](https://github.com/sponsors/Skillnter)
[![Open Collective](https://img.shields.io/badge/Open%20Collective-3385FF?logo=open-collective&logoColor=white)](https://opencollective.com/skillnter)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/skillnter)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?logo=patreon&logoColor=white)](https://www.patreon.com/skillnter)
[![PayPal](https://img.shields.io/badge/PayPal-003087?logo=paypal&logoColor=fff)](https://www.paypal.me/skillnte)

## Features

-   **Official `http-error-kit` Extension** – The recommended middleware for Restify apps.
-   **Auto-sets HTTP status codes** – Ensures the response status matches the error type.
-   **Plug-and-Play Middleware** – Just drop it before starting your server!
-   **Graceful Fallbacks** – Passes unrecognized errors to the next middleware.

## Table of Content

-   [Installation](#installation)
-   [Usage](#usage)
-   [How It Works](#how-it-works)
-   [Why Use @wthek/restify-middleware?](#why-use-wthekrestify-middleware)
-   [Explore More WTHek Extensions](#explore-more-wthek-extensions)
-   [People](#people)
-   [Donations](#donations)
-   [License](#license)

## Installation

```console
npm install @wthek/restify-middleware
```

## Usage

**Add Middleware Just Before Starting the Server**

To catch all errors correctly, place `KitRestifyMiddleware()` after all routes but before starting your Restify server.

```Javascript
import restify from 'restify';
import { KitHttpError, BadRequestError } from "http-error-kit";
import { KitRestifyMiddleware } from "@wthek/restify-middleware";

const server = restify.createServer();

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/test', (req, res, next) => {
  return next(new KitHttpError('This is a bad request', { statusCode: 400 }));
});

// Error handler
server.on('restifyError', KitRestifyMiddleware());

server.listen(3000, () => {
  console.log('🚀 Server listening on http://localhost:3000');
});
```

## How It Works

-   Catches errors thrown in routes and middleware
-   Checks if the error is an instance of any `http-error-kit` Errors
-   Formats the error response and sets the correct HTTP status code
-   Passes other errors to the next middleware (_so they can be handled separately_)

## Why Use `@wthek/restify-middleware`?

-   **No more manual error handling** – Status codes are automatically set.
-   **Consistent API responses** – Standardized errors improve debugging & logging.
-   **Works perfectly with `http-error-kit`** – Fully compatible with existing `http-error-kit` error structures.

## Explore More WTHek Extensions

The WTHek ecosystem continues to grow with new extensions to simplify error handling across various frameworks and libraries. Stay updated with the latest tools that integrate seamlessly with `http-error-kit`.

**Check out the official list of extensions**: [Official Extensions List](https://github.com/Skillnter/http-error-kit/wiki/Official-Extensions-List)

## People

The original author of the project is [Himanshu Bansal][skillnter]

## Donations

**This is all voluntary work**, so if you want to support my efforts you can

-   [Buy Me A Coffee](https://www.buymeacoffee.com/skillnter)
-   [Paypal](https://www.paypal.me/skillnte)
-   [GitHub Sponsor](https://github.com/sponsors/Skillnter)
-   [Patreon](https://www.patreon.com/skillnter)
-   [Open Collective](https://opencollective.com/skillnter)

You can also use the following:

![BTC: qzqmpxux3m56qqhz465u8022q9z63w2sysq4u9ltwj](https://img.shields.io/badge/BTC-qzqmpxux3m56qqhz465u8022q9z63w2sysq4u9ltwj-brightgreen)

![ETH: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/ETH-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

## License

`@wthek/restify-middleware` project is open-sourced software licensed under the [MIT license](LICENSE) by [Himanshu Bansal][skillnter].

[skillnter]: https://github.com/Skillnter/
[http-error-kit]: https://www.npmjs.com/package/http-error-kit
