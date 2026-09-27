/* =========================================================
 * 互動學習網｜課程目錄（唯一的課程清單來源）
 * ---------------------------------------------------------
 * 新增科目：在 subjects 陣列加入一筆，並建立同名資料夾與 index.html
 * 新增單元：在該科目的 units 加入一筆，status 設為 'ready'，
 *           並在科目資料夾下建立單元資料夾（index.html + data.js）
 * status：'ready' 已上線｜'soon' 製作中（顯示為灰色卡片）
 * ========================================================= */
window.HUB_CATALOG = {
  title: '互動學習網',
  subtitle: '課本＋習作重點整理・互動實驗・隨堂練習',
  subjects: [
    {
      id: 'sci5a',
      name: '自然五上',
      subject: '自然科學',
      grade: '五年級上學期',
      icon: '🔬',
      theme: 'mint',
      path: '自然五上/',
      status: 'ready',
      units: [
        {
          id: 'sci5a-u1', no: 1, title: '太陽的祕密', icon: '☀️',
          path: '單元1_太陽的祕密/', status: 'ready',
          sections: ['1-1 太陽與生活', '1-2 太陽的位置變化', '1-3 光的折射']
        },
        {
          id: 'sci5a-u2', no: 2, title: '千變萬化的植物', icon: '🌱',
          path: '單元2_千變萬化的植物/', status: 'ready',
          sections: ['2-1 不同環境的植物', '2-2 植物存活的本事', '2-3 植物繁衍大顯身手', '2-4 植物的特徵與分類']
        },
        { id: 'sci5a-u3', no: 3, title: '神奇的水溶液', icon: '🧪', path: '單元3_神奇的水溶液/', status: 'soon', sections: [] },
        { id: 'sci5a-u4', no: 4, title: '力與運動', icon: '🧲', path: '單元4_力與運動/', status: 'soon', sections: [] }
      ]
    },
    {
      id: 'soc5a', name: '社會五上', subject: '社會', grade: '五年級上學期',
      icon: '🗺️', theme: 'cream', path: '社會五上/', status: 'ready',
      units: [
        {
          id: 'soc5a-u1', no: 1, title: '臺灣的位置與先民足跡', icon: '🏝️',
          path: '單元1_臺灣的位置與先民足跡/', status: 'ready',
          sections: ['第1課 從地圖探索位置與發展有何關聯？', '第2課 史前人們如何善用資源維持生活？', '第3課 原住民族的文化與環境有何關聯？']
        },
        {
          id: 'soc5a-u2', no: 2, title: '臺灣登上國際舞臺', icon: '⛵',
          path: '單元2_臺灣登上國際舞臺/', status: 'ready',
          sections: ['第1課 臺灣為什麼在大航海時代崛起？', '第2課 大航海時代在臺灣留下哪些影響？']
        },
        { id: 'soc5a-u3', no: 3, title: '成為清帝國的領土', icon: '📜', path: '單元3_成為清帝國的領土/', status: 'soon', sections: [] },
        { id: 'soc5a-u4', no: 4, title: '土地的利用與變遷', icon: '🏞️', path: '單元4_土地的利用與變遷/', status: 'soon', sections: [] }
      ]
    },
    {
      id: 'sci6a', name: '自然六上', subject: '自然科學', grade: '六年級上學期',
      icon: '🔭', theme: 'mint', path: '自然六上/', status: 'soon', units: []
    },
    {
      id: 'soc6a', name: '社會六上', subject: '社會', grade: '六年級上學期',
      icon: '🌏', theme: 'sky', path: '社會六上/', status: 'ready',
      units: [
        {
          id: 'soc6a-u1', no: 1, title: '消費選擇與理財規劃', icon: '💰',
          path: '單元1_消費選擇與理財規劃/', status: 'ready',
          sections: ['第1課 消費如何聰明選擇並守護權益？', '第2課 為什麼要理財規劃與評估風險？']
        },
        { id: 'soc6a-u2', no: 2, title: '戰後經濟轉型與生活轉變', icon: '🏭', path: '單元2_戰後經濟轉型與生活轉變/', status: 'soon', sections: [] },
        { id: 'soc6a-u3', no: 3, title: '迎向科技發展新挑戰', icon: '🤖', path: '單元3_迎向科技發展新挑戰/', status: 'soon', sections: [] },
        { id: 'soc6a-u4', no: 4, title: '生活中的規範與運作', icon: '⚖️', path: '單元4_生活中的規範與運作/', status: 'soon', sections: [] }
      ]
    }
  ]
};
