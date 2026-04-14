# device-fingerprint

[![npm version](https://img.shields.io/npm/v/@smd00/device-fingerprint.svg?label=npm&logo=npm)](https://www.npmjs.com/package/@smd00/device-fingerprint)
[![npm downloads](https://img.shields.io/npm/dm/@smd00/device-fingerprint.svg?label=downloads&logo=npm)](https://www.npmjs.com/package/@smd00/device-fingerprint)

**[Install from npm → `@smd00/device-fingerprint`](https://www.npmjs.com/package/@smd00/device-fingerprint)**

Lightweight browser device fingerprint: navigator/screen/timezone signals plus canvas and WebGL snippets, hashed to a short `device_*` id. Includes **`collectDeviceData`** (client) and **`generateServerDeviceFingerprint`** (server) so you can recompute the same id from posted JSON.

Personal / experimental package — updates when needed. Not a substitute for dedicated identity products if you need high accuracy.

## Install

```bash
npm install @smd00/device-fingerprint
```

## Usage

**Client (browser)**

```ts
import {
  collectDeviceData,
  generateDeviceFingerprint,
} from "@smd00/device-fingerprint";

const id = generateDeviceFingerprint();

const payload = await collectDeviceData();
// POST payload to your API
```

`collectDeviceData` returns a `Promise` so you can `await` it (same data as `collectDeviceDataSync()`, which is available if you need a synchronous call).

**Server**

```ts
import { generateServerDeviceFingerprint } from "@smd00/device-fingerprint";

const id = generateServerDeviceFingerprint({
  ...bodyFromClient,
  ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
});
```

## Privacy

Fingerprinting can be regulated (e.g. GDPR/ePrivacy). Disclose it in your privacy policy and use it only for purposes you document.

## Publish to npm

```bash
npm install
npm run build
npm publish --access public
```

(`--access public` is required once for scoped packages.)

## License

MIT
