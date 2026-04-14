# device-fingerprint

**npm:** [`@smd00/device-fingerprint`](https://www.npmjs.com/package/@smd00/device-fingerprint) — the unscoped name `device-fingerprint` was already taken on npm (another package since 2017), so this library is published under the `@smd00` scope. If your npm username is not `smd00`, change the scope in `package.json` to match before publishing.

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
