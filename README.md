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
![npm bundle size (version)](https://img.shields.io/bundlephobia/minzip/%40wthek%2Frestify-middleware/1.1.0)
[![Socket Badge](https://socket.dev/api/badge/npm/package/@wthek/restify-middleware/1.1.0)](https://socket.dev/npm/package/@wthek/restify-middleware/overview/1.1.0)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-121013?logo=github&logoColor=white)](https://skillnter.github.io/wthek-restify-middleware/)
[![Github Sponsors](https://img.shields.io/badge/GitHub%20Sponsors-30363D?&logo=GitHub-Sponsors&logoColor=EA4AAA)](https://github.com/sponsors/Skillnter)
[![Open Collective](https://img.shields.io/badge/Open%20Collective-3385FF?logo=open-collective&logoColor=white)](https://opencollective.com/skillnter)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/skillnter)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?logo=patreon&logoColor=white)](https://www.patreon.com/skillnter)
[![PayPal](https://img.shields.io/badge/PayPal-003087?logo=paypal&logoColor=fff)](https://www.paypal.me/skillnte)

## Features

-   **Official `http-error-kit` Extension** – The recommended middleware for Restify apps.
-   **Auto-sets HTTP status codes** – Ensures the response status matches the error type.
-   **Plug-and-Play Middleware** – Just attach it to `server.on('restifyError', ...)`!
-   **`headersSent` Protection** – Prevents `ERR_HTTP_HEADERS_SENT` crashes when headers have already been sent.
-   **Configurable Logging** – Easily enable console logging or pass a custom logger callback (Bunyan, Winston, Pino).
-   **`handleUnknownErrors` Option** – Optionally catch non-Kit errors and return a structured 500 response.
-   **Graceful Fallbacks** – Passes unformatted errors to the next handler by default.

## Table of Content

-   [Installation](#installation)
-   [Usage](#usage)
-   [Options](#options)
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

**Add Error Handler on `restifyError`**

To catch all errors correctly, attach `KitRestifyMiddleware()` to the `restifyError` event on your Restify server.

```javascript
import restify from 'restify';
import { KitHttpError } from "http-error-kit";
import { KitRestifyMiddleware } from "@wthek/restify-middleware";

const server = restify.createServer();

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.get('/test', (req, res, next) => {
  return next(new KitHttpError(400, "Bad Request"));
});

// Centralized error handler
server.on('restifyError', KitRestifyMiddleware());

server.listen(3000, () => {
  console.log('🚀 Server listening on http://localhost:3000');
});
```

**With Options**

```javascript
import restify from 'restify';
import { KitRestifyMiddleware } from "@wthek/restify-middleware";

const server = restify.createServer();

server.on(
  'restifyError',
  KitRestifyMiddleware({
    log: true,                // Logs errors via console.error
    handleUnknownErrors: true // Returns structured 500 for non-Kit errors
  })
);
```

**Custom Logger**

```javascript
import restify from 'restify';
import { KitRestifyMiddleware } from "@wthek/restify-middleware";

const server = restify.createServer();

server.on(
  'restifyError',
  KitRestifyMiddleware({
    log: (error, req) => {
      // Custom logger callback (e.g. Bunyan, Winston, Pino)
      req.log ? req.log.error(error) : console.error(error);
    }
  })
);
```

## Options

| Option                | Type                                    | Default | Description                                                                                                                             |
| --------------------- | --------------------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `log`                 | `boolean \| ((error, req) => void)`     | `false` | When `true`, logs via `console.error`. When a function, uses your custom callback.                                                      |
| `handleUnknownErrors` | `boolean`                               | `false` | When `true`, returns a structured `{ statusCode: 500, message: "Internal Server Error" }` for non-Kit errors instead of forwarding raw errors. |

## How It Works

-   Catches errors emitted or passed through Restify route handlers via `server.on('restifyError', ...)`.
-   Checks `res.headersSent` to prevent `ERR_HTTP_HEADERS_SENT` crashes.
-   Checks if the error is an instance of `KitHttpError` or `KitGeneralError`.
-   Formats the error response with `error.toJSON()` and sets the matching HTTP status code.
-   If `handleUnknownErrors` is enabled, formats unrecognized errors into structured 500 responses.
-   Delegates to `next()` to continue Restify's handler lifecycle.

## Why Use `@wthek/restify-middleware`?

-   **No more manual error handling** – Status codes and payloads are automatically set.
-   **Consistent API responses** – Standardized JSON errors improve debugging and client-side handling.
-   **Works perfectly with `http-error-kit`** – Fully compatible with existing `http-error-kit` error structures.
-   **Production-safe** – Response guards prevent double-send crashes and structured fallbacks protect against leaking raw stack traces.

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

![BTC: bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf](https://img.shields.io/badge/BTC-bc1p22h4nsad5d8ketyhuvf0vyva6unttxwzzqvkty5r839as0mlclgs72d3mf-brightgreen)

![ETH: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/ETH-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

![BNB: 0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889](https://img.shields.io/badge/BNB-0x1D59a291391a3CE17C63D5dC50F258Dc0Ab62889-brightgreen)

## License

`@wthek/restify-middleware` project is open-sourced software licensed under the [MIT license](LICENSE) by [Himanshu Bansal][skillnter].

[skillnter]: https://github.com/Skillnter/
[http-error-kit]: https://www.npmjs.com/package/http-error-kit
