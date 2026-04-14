/**
 * Generate a device fingerprint using available browser/device characteristics.
 * Creates a stable-ish identifier without MAC address access (not available in browsers).
 *
 * Browser-only: do not call from Node without a DOM.
 */
export function generateDeviceFingerprint(): string {
  if (typeof window === "undefined") {
    return "server-side";
  }

  const components: string[] = [];

  components.push(navigator.userAgent || "unknown");
  components.push(`${window.screen.width}x${window.screen.height}`);
  components.push(`${screen.colorDepth || 24}`);
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown");
  components.push(navigator.language || "unknown");
  components.push(navigator.platform || "unknown");
  components.push(`${navigator.hardwareConcurrency || 0}`);

  if ("deviceMemory" in navigator && typeof navigator.deviceMemory === "number") {
    components.push(`${navigator.deviceMemory}`);
  }

  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("Device fingerprint", 2, 15);
      components.push(canvas.toDataURL().slice(-50));
    }
  } catch {
    // Canvas fingerprinting not available
  }

  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "");
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "");
      }
    }
  } catch {
    // WebGL not available
  }

  return `device_${hashToBase36(components.join("|"))}`;
}

export type DeviceData = {
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
  colorDepth: number;
  timezone: string;
  language: string;
  platform: string;
  hardwareConcurrency: number;
  deviceMemory?: number;
  canvasFingerprint: string;
  webglVendor?: string;
  webglRenderer?: string;
};

/**
 * Collect device characteristics synchronously (browser APIs used are sync).
 * Prefer {@link collectDeviceData} with `await` at call sites so the API stays
 * extensible if future signals become async (e.g. Permissions API).
 */
export function collectDeviceDataSync(): DeviceData {
  if (typeof window === "undefined") {
    return {
      userAgent: "server-side",
      screenWidth: 0,
      screenHeight: 0,
      colorDepth: 24,
      timezone: "unknown",
      language: "unknown",
      platform: "unknown",
      hardwareConcurrency: 0,
      canvasFingerprint: "server-side",
    };
  }

  let canvasFingerprint = "";
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 50;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.textBaseline = "top";
      ctx.font = "14px Arial";
      ctx.fillStyle = "#f60";
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = "#069";
      ctx.fillText("Device fingerprint", 2, 15);
      canvasFingerprint = canvas.toDataURL().slice(-50);
    }
  } catch {
    // Canvas fingerprinting not available
  }

  let webglVendor = "";
  let webglRenderer = "";
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    if (gl) {
      const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
      if (debugInfo) {
        webglVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || "";
        webglRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || "";
      }
    }
  } catch {
    // WebGL not available
  }

  return {
    userAgent: navigator.userAgent || "unknown",
    screenWidth: window.screen.width || 0,
    screenHeight: window.screen.height || 0,
    colorDepth: screen.colorDepth || 24,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown",
    language: navigator.language || "unknown",
    platform: navigator.platform || "unknown",
    hardwareConcurrency: navigator.hardwareConcurrency || 0,
    deviceMemory:
      "deviceMemory" in navigator && typeof navigator.deviceMemory === "number"
        ? navigator.deviceMemory
        : undefined,
    canvasFingerprint,
    webglVendor,
    webglRenderer,
  };
}

/**
 * Same as {@link collectDeviceDataSync}, wrapped in a Promise for `await` ergonomics
 * and forward compatibility with async browser APIs.
 */
export async function collectDeviceData(): Promise<DeviceData> {
  return collectDeviceDataSync();
}

export type ServerFingerprintInput = {
  userAgent?: string;
  screenWidth?: number;
  screenHeight?: number;
  colorDepth?: number;
  timezone?: string;
  language?: string;
  platform?: string;
  hardwareConcurrency?: number;
  deviceMemory?: number;
  canvasFingerprint?: string;
  webglVendor?: string;
  webglRenderer?: string;
  ipAddress?: string;
};

/**
 * Build the same fingerprint string server-side from collected fields (and optional IP).
 * Not cryptographically secure; suitable for heuristics / soft fraud signals.
 */
export function generateServerDeviceFingerprint(deviceData: ServerFingerprintInput): string {
  const components: string[] = [];

  components.push(deviceData.userAgent || "unknown");
  components.push(`${deviceData.screenWidth || 0}x${deviceData.screenHeight || 0}`);
  components.push(`${deviceData.colorDepth || 24}`);
  components.push(deviceData.timezone || "unknown");
  components.push(deviceData.language || "unknown");
  components.push(deviceData.platform || "unknown");
  components.push(`${deviceData.hardwareConcurrency || 0}`);

  if (deviceData.deviceMemory) {
    components.push(`${deviceData.deviceMemory}`);
  }

  if (deviceData.canvasFingerprint) {
    components.push(deviceData.canvasFingerprint);
  }

  if (deviceData.webglVendor) {
    components.push(deviceData.webglVendor);
  }
  if (deviceData.webglRenderer) {
    components.push(deviceData.webglRenderer);
  }

  if (deviceData.ipAddress && deviceData.ipAddress !== "unknown") {
    components.push(deviceData.ipAddress);
  }

  return `device_${hashToBase36(components.join("|"))}`;
}

function hashToBase36(fingerprintString: string): string {
  let hash = 0;
  for (let i = 0; i < fingerprintString.length; i++) {
    const char = fingerprintString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
