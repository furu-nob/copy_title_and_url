# copy_title_and_url

## Chrome Plugin 
Plugin to copy page title and URL in Wiki format.

* Option Example
  * Markdown <-- default  
  ```[{title}]({url})```
  * Textile  
  ```"{title}":{url}```
  * Custum (You can Write lile bellow.)  
   {title}, {url}

* やりたいこと
  * notifications にコピーした内容を追加 →追加した
  * エラーハンドリング → http https 以外のページではエラーを出したい -> 追加した。  
  **拡張機能の管理画面（chrome://extensions/）で「ファイルのURLへのアクセスを許可する」** をONにする必要あり

※このコードはChatGPTとやり取りしながら作成しています。  
こんな感じ -> [コピー内容通知追加](https://chatgpt.com/share/68148376-9d1c-8003-8c43-f41d5b4d638d)
