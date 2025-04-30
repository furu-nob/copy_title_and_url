document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form');
  const customInput = document.getElementById('customFormat');
  const status = document.getElementById('status');

  // 保存済み設定を復元
  chrome.storage.sync.get(['formatType', 'customFormat'], (items) => {
    if (items.formatType) {
      const radio = document.querySelector(`input[name="format"][value="${items.formatType}"]`);
      if (radio) radio.checked = true;
    }
    if (items.customFormat) {
      customInput.value = items.customFormat;
    }
    toggleCustomInput();
  });

  // カスタム入力欄の有効・無効切り替え
  function toggleCustomInput() {
    const customRadio = document.querySelector('input[name="format"][value="custom"]');
    customInput.disabled = !customRadio.checked;
  }

  document.querySelectorAll('input[name="format"]').forEach(radio => {
    radio.addEventListener('change', toggleCustomInput);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedFormat = document.querySelector('input[name="format"]:checked').value;
    const customFormat = customInput.value.trim();

    if (selectedFormat === 'custom' && customFormat === '') {
      status.textContent = 'カスタム形式を入力してください。';
      return;
    }

    chrome.storage.sync.set({
      formatType: selectedFormat,
      customFormat: customFormat
    }, () => {
      status.textContent = '保存しました！';
      setTimeout(() => { status.textContent = ''; }, 1500);
    });
  });
});
