// Ad Network Integration & Pop-Under Trigger Manager for StreamNova

export const DEFAULT_AD_POP_URL = "https://www.google.com"; // Default test pop-under URL or network link

export function triggerPopUnderAd(adUrl?: string) {
  if (typeof window === "undefined") return;

  const targetUrl = adUrl || DEFAULT_AD_POP_URL;
  try {
    // Open ad link in new tab when user interacts with player or watch button
    const adWindow = window.open(targetUrl, "_blank", "noopener,noreferrer");
    if (adWindow) {
      adWindow.blur();
      window.focus();
    }
  } catch (e) {
    console.warn("Pop-under blocked or prevented by browser:", e);
  }
}
