const DEVICE_ID_STORAGE_KEY = "fitness-device-id";

const createFallbackDeviceId = (): string => {
  const randomPart = Math.random().toString(36).slice(2);
  return `device-${Date.now()}-${randomPart}`;
};

export const getDeviceId = (): string => {
  const storedDeviceId = localStorage.getItem(DEVICE_ID_STORAGE_KEY);

  if (storedDeviceId) {
    return storedDeviceId;
  }

  const deviceId =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : createFallbackDeviceId();

  localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  return deviceId;
};
