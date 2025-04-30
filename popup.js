document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('copyBtn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    status.textContent = "";

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      status.textContent = "タブ情報取得失敗";
      return;
    }
    const title = tab.title;
    const url = tab.url;

    const { formatType, customFormat } = await chrome.storage.sync.get({
      formatType: 'redmine',
      customFormat: ''
    });

    let formattedText = "";
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
        formattedText = `[[${title}|${url}]]`;
    }

    try {
      await navigator.clipboard.writeText(formattedText);
      status.textContent = "コピーしました！";
    } catch (e) {
      status.textContent = "コピーに失敗しました";
      console.error(e);
    }
  });
});
