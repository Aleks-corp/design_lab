// WayForPay reasonCode -> a specific i18n key under "profile.decline-reason.*"
// https://wiki.wayforpay.com/en/view/852131
const DECLINE_REASON_KEYS: Record<number, string> = {
  1101: "bank-declined",
  1102: "bad-cvv",
  1103: "expired-card",
  1104: "insufficient-funds",
  1105: "invalid-card",
  1106: "card-limit",
  1108: "three-ds-fail",
  1114: "fraud",
  1122: "gateway-declined",
  1135: "card-limit",
};

export const getDeclineReasonKey = (code?: number | null): string =>
  (code && DECLINE_REASON_KEYS[code]) || "generic";
