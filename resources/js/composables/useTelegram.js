export function useTelegram() {
  const initTelegram = () => {
    console.log('Telegram WebApp initialized');
    
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
      console.log('Telegram WebApp is ready');
    } else {
      console.log('Not in Telegram WebApp environment');
    }
  }

  return {
    initTelegram
  }
}