# 觸控小遊戲 TouchGames

大屏觸控螢幕專用遊戲平台，適合教室互動教學使用。  
內建 Kiosk 鎖定機制，學生只能在遊戲頁面中操作，無法離開瀏覽器或切換到其他應用程式。

---

## 專案結構

```
20260617_TouchGames/
├── index.html              ← 遊戲選單首頁
├── 啟動觸控小遊戲.bat      ← Kiosk 模式啟動器（雙擊執行）
├── close_server.ps1        ← 背景關閉伺服器（由 .bat 自動啟動，勿手動執行）
├── Basketball/
│   └── index.html          ← 投籃挑戰
├── ChoiceGame/
│   └── index.html          ← 互動分類大冒險
├── SweetPop/
│   └── index.html          ← 甜點慶典
├── Knowledge/
│   ├── index.html          ← 校園知識王
│   ├── game.js             ← 遊戲邏輯
│   └── questions.js        ← 題目資料
└── MusicNinja/
    └── index.html          ← 音樂忍者（獨立遊戲，尚未加入主選單）
```

---

## 啟動方式

1. 確認電腦已安裝 **Google Chrome**
2. 雙擊 `啟動觸控小遊戲.bat`
3. Chrome 會以 Kiosk 全螢幕模式開啟，學生即可開始使用

> **需求環境：** Windows + Google Chrome（無需安裝 Python 或其他套件，PowerShell 為 Windows 內建）

---

## Kiosk 鎖定機制

| 功能 | 說明 |
|------|------|
| 全螢幕鎖定 | 使用 `--kiosk` 旗標啟動 Chrome，隱藏所有瀏覽器 UI |
| 防止下滑退出 | Kiosk 模式下，觸控螢幕從上方下滑無法觸發任何瀏覽器操作 |
| 防止切換 App | Kiosk 模式佔據整個螢幕，學生無法切換至其他視窗 |
| 密碼保護退出 | 右上角鎖頭按鈕，輸入正確密碼後才能關閉 |

---

## 老師操作說明

### 開啟
雙擊 `啟動觸控小遊戲.bat`，約 2 秒後 Chrome 以全螢幕 Kiosk 模式自動開啟。

### 關閉（密碼退出）
1. 點擊畫面**右上角鎖頭按鈕（🔒）**
2. 輸入密碼：**`343601`**
3. 點擊「點此關閉」按鈕，Chrome 自動關閉

### 緊急強制關閉
若無法正常關閉，可使用鍵盤按 `Alt + F4`。

---

## 遊戲介紹

### 🏀 投籃挑戰（Basketball）
觸控投籃小遊戲，透過觸碰螢幕控制投籃方向與力道。

### 🤖 互動分類大冒險（ChoiceGame）
分類互動遊戲，學生依照題目將物件拖放到正確類別。

### 🎮 甜點慶典（SweetPop）
甜點主題的消除類遊戲，以觸控方式操作。

### 📖 校園知識王（Knowledge）
校園知識問答遊戲，題目資料存放於 `questions.js`，可自行編輯新增題目。

---

## 首頁導覽功能

- 點擊遊戲卡片 → 進入遊戲（同頁切換，不開新分頁）
- 每個遊戲頁面左上角有**粉色小屋按鈕（🏠）** → 點擊返回首頁

---

## 技術說明

### 啟動流程（啟動觸控小遊戲.bat）
1. 偵測 Chrome 安裝路徑（Program Files / Program Files x86 / LocalAppData）
2. 使用 PowerShell `[uri]::new()` 將含中文的路徑正確轉換為 `file:///` URL
3. 關閉既有的 Chrome 行程
4. 背景啟動 `close_server.ps1`（PowerShell HTTP 伺服器，監聽 `127.0.0.1:9999`）
5. 以 `--kiosk` 旗標啟動 Chrome

### 關閉伺服器（close_server.ps1）
- 使用 PowerShell 內建 `System.Net.HttpListener` 建立本機 HTTP 伺服器
- 監聽 `http://127.0.0.1:9999/close`
- 收到請求後執行 `Stop-Process -Name chrome` 強制關閉 Chrome
- **無需安裝任何套件**，Windows 內建 PowerShell 即可運作

### 密碼驗證（index.html）
- 密碼以明文存於 `index.html` 的 JavaScript 常數 `CORRECT_PW`
- 若需更改密碼，編輯 `index.html` 第 221 行：
  ```javascript
  const CORRECT_PW = '343601';
  ```

---

## 部署到其他電腦

1. 複製整個 `20260617_TouchGames/` 資料夾到目標電腦
2. 確認目標電腦已安裝 Google Chrome
3. 雙擊 `啟動觸控小遊戲.bat` 即可，無需其他設定

---

## 注意事項

- `close_server.ps1` 由批次檔自動管理，**請勿手動執行**
- 若 Chrome 不在標準路徑，請手動編輯 `啟動觸控小遊戲.bat` 中的 Chrome 路徑
- MusicNinja 尚未整合至主選單，如需加入請自行在 `index.html` 新增卡片
