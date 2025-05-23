chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id || !tab.url) return;

  // http/https以外のページは拒否
  if (!/^https?:\/\//.test(tab.url)) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'favicon_2.png',
      title: 'コピー失敗',
      message: 'このページのURLはコピーできません。'
    });
    return;
  }

  const title = tab.title;
  const url = tab.url;

  const options = await chrome.storage.sync.get(['formatType', 'customFormat']);
  const formatType = options.formatType || 'markdown';
  const customFormat = options.customFormat || '';

  let formattedText = '';
  switch (formatType) {
    case 'markdown':
      formattedText = `[${title}](${url})`;
      break;
    case 'textile':
      formattedText = `"${title}":${url}`;
      break;
    case 'custom':
      formattedText = customFormat.replace(/\{title\}/g, title).replace(/\{url\}/g, url);
      break;
    default:
      formattedText = `[[${title}|${url}]]`; // Redmine wiki形式
  }

  // コピー処理
  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        console.error('Clipboard write failed', err);
      }
    },
    args: [formattedText]
  });

  // 通知用に切り詰め
  const maxLength = 100;
  const displayText = formattedText.length > maxLength
    ? formattedText.slice(0, maxLength - 1) + '…'
    : formattedText;

  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'favicon_2.png',
    title: 'コピー完了',
    message: `タイトルとURLをコピーしました:\n${displayText}`
  });
});
