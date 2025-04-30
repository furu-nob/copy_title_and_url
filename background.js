chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.id || !tab.url) return;

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

  // アクティブなページでコピー処理を実行
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

  // 通知表示
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'favicon_2.png',
    title: 'コピー完了',
    message: 'タイトルとURLをコピーしました。'
  });
});
