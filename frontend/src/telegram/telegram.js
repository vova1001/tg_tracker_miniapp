export function getTelegram() {
  if (window.Telegram && window.Telegram.WebApp) return window.Telegram.WebApp;
  return null;
}

export function getInitData() {
  const tg = getTelegram();
  return tg ? tg.initData : null;
}
