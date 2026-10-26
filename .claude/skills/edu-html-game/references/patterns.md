# 技術模式

所有片段都是瀏覽器原生 JavaScript，不需任何套件。

## 1. 拖曳（Pointer Events，滑鼠與觸控共用）

```css
.draggable { touch-action: none; cursor: grab; }   /* 拖曳時不要捲動頁面 */
.dragging  { position: fixed; z-index: 20; pointer-events: none; transform: scale(1.08); }
```

```js
function makeDraggable(el, onDrop) {
  let startX, startY, offX, offY, home;
  el.addEventListener('pointerdown', (e) => {
    if (state.locked) return;
    el.setPointerCapture(e.pointerId);           // 手指移出元素也持續收到事件
    const r = el.getBoundingClientRect();
    offX = e.clientX - r.left; offY = e.clientY - r.top;
    startX = e.clientX; startY = e.clientY;
    home = { parent: el.parentNode, next: el.nextSibling };
    el.style.width = r.width + 'px';
    el.classList.add('dragging');
    move(e);
  });
  function move(e) {
    el.style.left = (e.clientX - offX) + 'px';
    el.style.top = (e.clientY - offY) + 'px';
  }
  el.addEventListener('pointermove', (e) => { if (el.hasPointerCapture(e.pointerId)) move(e); });
  el.addEventListener('pointerup', (e) => {
    el.releasePointerCapture(e.pointerId);
    el.classList.remove('dragging');
    el.style.left = el.style.top = el.style.width = '';
    // .dragging 有 pointer-events:none，所以這裡拿到的是下面的目標
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-bin]');
    const moved = Math.hypot(e.clientX - startX, e.clientY - startY) > 8;
    if (moved && target) onDrop(el, target);
    else home.parent.insertBefore(el, home.next);   // 沒放到目標就回原位
  });
  el.addEventListener('pointercancel', () => {
    el.classList.remove('dragging');
    el.style.left = el.style.top = el.style.width = '';
  });
}
```

另外保留「點卡片 → 點籃子」的替代操作，給觸控不穩或用鍵盤的學生。

## 2. 遊戲迴圈（requestAnimationFrame + dt）

```js
let last = 0, running = false;
function startLoop() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }
function stopLoop() { running = false; }
function frame(now) {
  if (!running) return;
  const dt = Math.min((now - last) / 1000, 0.05);   // 上限 0.05 秒：切分頁回來不瞬移
  last = now;
  update(dt);      // 只改 state：位置 += 速度 * dt
  render();        // 只負責畫
  requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => { document.hidden ? stopLoop() : startLoop(); });
```

選擇題、配對這類回合制遊戲**不需要**遊戲迴圈，事件驅動即可；只有打地鼠、接物、彩帶粒子需要。

## 3. 狀態與畫面分離、輸入鎖定

```js
const state = { cards: [], first: null, second: null, lock: false, moves: 0 };

function flip(i) {
  const c = state.cards[i];
  if (state.lock || c.open || c.done) return;     // 動畫/判斷中不收輸入
  c.open = true;
  if (state.first === null) state.first = i;
  else {
    state.second = i; state.moves++; state.lock = true;
    setTimeout(resolvePair, 800);
  }
  render();
}
function resolvePair() {
  const a = state.cards[state.first], b = state.cards[state.second];
  if (a.pair === b.pair) { a.done = b.done = true; feedback('medium'); }
  else { a.open = b.open = false; feedback('wrong'); }
  state.first = state.second = null; state.lock = false;
  render();
  if (state.cards.every((c) => c.done)) finishGame();
}
```

## 4. 打散

```js
function shuffle(arr) {                     // Fisher–Yates，不要用 sort(() => Math.random() - .5)
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// 打散選項時，答案索引要跟著換
const order = shuffle(item.options.map((_, i) => i));
const options = order.map((i) => item.options[i]);
const ans = order.indexOf(item.ans);
```

## 5. 回饋分級

```js
function feedback(tier, x = innerWidth / 2, y = innerHeight / 2) {
  if (tier === 'small') { beep('tick'); }
  if (tier === 'medium') { beep('right'); burst(x, y, 20); }
  if (tier === 'large') { beep('win'); burst(x, y, 60); }
  if (tier === 'wrong') { beep('wrong'); }
}
// 重播 CSS 動畫：先移除 class、強制重排、再加回
function replayAnim(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }
```

CSS：

```css
.pop   { animation: pop .35s cubic-bezier(.34,1.56,.64,1); }   /* 超過一點再彈回 */
@keyframes pop { from { transform: scale(.8); } to { transform: scale(1); } }
.shake { animation: shake .3s ease-out; }
@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
@media (prefers-reduced-motion: reduce) { .pop, .shake { animation: none; } }
```

彩帶粒子 `burst()` 的完整實作見 `assets/starter.html` 第 5 段。

## 6. 本機紀錄（版本化、防呆）

```js
const SAVE_KEY = 'edu-game:' + GAME_ID;    // 每個遊戲不同的 id，發布後不要改
const SAVE_VERSION = 1;
function loadSave() {
  try {
    const data = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (data && data.version === SAVE_VERSION) return data;
    // 未來改版：if (data && data.version === 1) return migrateV1(data);
  } catch (e) { /* 私密模式、被清除、資料損壞 */ }
  return { version: SAVE_VERSION, best: 0 };
}
function writeSave(data) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) {}
}
```

- 只存數字、布林、短字串。**不存學生姓名**；若要顯示「玩家暱稱」，只存在本機並預設空白。
- 讀進來的資料不要直接 `innerHTML`。
- 學校電腦多人共用：結果畫面可提供「清除紀錄」按鈕。

## 7. 音效（WebAudio 合成）

```js
let audioCtx = null;
function tone(freq, start, dur, type = 'sine') {
  audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
  const t = audioCtx.currentTime + start;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.18, t + 0.02);   // 快速淡入，避免爆音
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(audioCtx.destination);
  o.start(t); o.stop(t + dur + 0.02);
}
// 答對：tone(660,0,.15); tone(880,.09,.18)
// 答錯：tone(220,0,.18,'triangle'); tone(180,.09,.2,'triangle')
// 過關：[523,659,784,1047].forEach((f,i)=>tone(f,i*.09,.2))
```

瀏覽器規定：`AudioContext` 要在使用者點擊後才會發聲，所以在第一次按鈕事件裡才建立。
音量保持 0.2 以下，教室同時多台播放才不會太吵。

## 8. Canvas 高解析

```js
function fitCanvas(cv) {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const r = cv.getBoundingClientRect();
  cv.width = r.width * dpr; cv.height = r.height * dpr;
  cv.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);   // 之後用 CSS 像素作畫
}
addEventListener('resize', () => fitCanvas(canvas));
```

## 9. 題庫核對（Node）

```js
// node check-bank.js 遊戲.html
const fs = require('fs');
const html = fs.readFileSync(process.argv[2], 'utf8');
const src = html.match(/const QUESTIONS = (\[[\s\S]*?\n\]);/)[1];
const QUESTIONS = Function('return ' + src)();
const seen = new Set(); let bad = 0;
QUESTIONS.forEach((q, i) => {
  if (!(q.ans >= 0 && q.ans < q.options.length)) { console.log('答案超出範圍', i, q.q); bad++; }
  if (new Set(q.options).size !== q.options.length) { console.log('選項重複', i, q.q); bad++; }
  if (seen.has(q.q)) { console.log('題目重複', i, q.q); bad++; }
  seen.add(q.q);
});
console.log(bad ? `❌ ${bad} 個問題` : `✅ ${QUESTIONS.length} 題全部正確`);
process.exit(bad ? 1 : 0);
```

## 10. Playwright 測試（桌機＋手機，自動玩一局）

```js
// node test-game.js Htmls/遊戲.html
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const url = 'file://' + path.resolve(process.argv[2]);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 844 } });
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(url);
    await page.screenshot({ path: `game-title-${width}.png` });
    await page.click('#btn-start');
    for (let i = 0; i < 20; i++) {
      if (!(await page.isVisible('#scr-game'))) break;
      await page.locator('.choice').first().click();
      if (i === 0) await page.screenshot({ path: `game-play-${width}.png` });
      await page.click('#btn-next');
    }
    await page.waitForSelector('#scr-result.on');
    await page.screenshot({ path: `game-result-${width}.png`, fullPage: true });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    console.log(width, errors.length ? '❌ 錯誤：' + errors.join(' | ') : '✅ 無 JS 錯誤',
      overflow ? '❌ 有水平捲動' : '✅ 無水平捲動',
      await page.textContent('#r-detail'));
    await page.close();
  }
  await browser.close();
})();
```

測試輸出的截圖放在 scratchpad 或暫存資料夾，**不要 commit 進儲存庫**。
