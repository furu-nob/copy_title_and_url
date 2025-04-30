chrome.action.onClicked.addListener(async (tab) => {
  const title = tab.title;
  const url = tab.url;

  // オプションから設定を取得
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
      // {title} と {url} を置換
      formattedText = customFormat.replace(/\{title\}/g, title).replace(/\{url\}/g, url);
      break;
    default:
      formattedText = `[${title}](${url})`;
  }

  try {
    await navigator.clipboard.writeText(formattedText);
    // コピー成功の通知（必要なら）
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'favicon.ico',
      title: 'コピー完了',
      message: formattedText
    });
  } catch (e) {
    console.error('コピーに失敗しました:', e);
  }
});
