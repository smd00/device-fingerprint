# device-fingerprint

Lightweight browser device fingerprint: navigator/screen/timezone signals plus canvas and WebGL snippets, hashed to a short `device_*` id. Includes **`collectDeviceData`** (client) and **`generateServerDeviceFingerprint`** (server) so you can recompute the same id from posted JSON.

Personal / experimental package — updates when needed. Not a substitute for dedicated identity products if you need high accuracy.

## Install

```bash
npm install device-fingerprint
```

## Usage

**Client (browser)**

```ts
import {
  collectDeviceData,
  generateDeviceFingerprint,
} from "device-fingerprint";

const id = generateDeviceFingerprint();

const payload = collectDeviceData();
// POST payload to your API
```

**Server**

```ts
import { generateServerDeviceFingerprint } from "device-fingerprint";

const id = generateServerDeviceFingerprint({
  ...bodyFromClient,
  ipAddress: req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
});
```

## Privacy

Fingerprinting can be regulated (e.g. GDPR/ePrivacy). Disclose it in your privacy policy and use it only for purposes you document.

## Publish to npm (first time)

1. [Create an npm account](https://www.npmjs.com/signup) and log in: `npm login`
2. If the name `device-fingerprint` is already taken on npm, use a scoped name in `package.json` (e.g. `@smd00/device-fingerprint`) and publish with `npm publish --access public`
3. From this directory:

```bash
npm install
npm run build
npm publish
```

(Use `npm publish --access public` for scoped packages.)

## License

MIT
