(() => {
  'use strict';

  // アレルギー情報はこのオブジェクトだけを編集すれば更新できます。
  const allergyData = {
    'gyoza': ['小麦', '豚肉', '大豆'], 'boiled-gyoza': ['小麦', '豚肉', '大豆'],
    'spring-roll': ['小麦', '豚肉', '大豆'], 'shumai': ['小麦', '豚肉', '大豆'],
    'ramen': ['卵', '小麦', '大豆', '豚肉', '鶏肉'], 'chashu-men': ['卵', '小麦', '大豆', '豚肉', '鶏肉'],
    'mapo-ramen': ['卵', '小麦', '大豆', '豚肉', 'ごま'], 'gomoku-ramen': ['卵', '小麦', 'えび', '大豆', '豚肉'],
    'fried-rice': ['卵', '小麦', '豚肉', '大豆'], 'tenshin': ['卵', '小麦', '大豆'],
    'mapo-don': ['小麦', '大豆', '豚肉', 'ごま'], 'chuka-don': ['小麦', 'えび', '大豆', '豚肉'],
    'mapo': ['大豆', '豚肉', 'ごま'], 'subuta': ['小麦', '豚肉', '大豆'],
    'hoikoro': ['小麦', '豚肉', '大豆', 'ごま'], 'ebi-chili': ['卵', '小麦', 'えび', '大豆'],
    'karaage': ['卵', '小麦', '鶏肉', '大豆'], 'nira-reba': ['小麦', '豚肉', '大豆', 'ごま'],
    'daily-lunch': ['内容は日替わりです。スタッフへご確認ください'], 'teishoku': ['定食により異なります。スタッフへご確認ください'],
    'ramen-set': ['卵', '小麦', '大豆', '豚肉', '鶏肉'], 'fried-rice-set': ['卵', '小麦', '大豆', '豚肉'],
    'gyoza-set': ['小麦', '大豆', '豚肉'], 'course-2600': ['コース内容により異なります。予約時にご相談ください'],
    'course-3800': ['コース内容により異なります。予約時にご相談ください']
  };

  // 料理タイプごとの写真。差し替える場合は images 内のファイル名を変更します。
  const menuImages = {
    'gyoza': 'gyoza.jpg', 'boiled-gyoza': 'boiled-gyoza.jpg', 'spring-roll': 'spring-roll.jpg', 'shumai': 'shumai.jpg',
    'ramen': 'ramen.jpg', 'chashu-men': 'chashu-men.jpg', 'mapo-ramen': 'mapo-ramen.jpg', 'gomoku-ramen': 'gomoku-ramen.jpg',
    'fried-rice': 'friedrice.jpg', 'tenshin': 'tenshinhan.jpg', 'mapo-don': 'mapo-don.jpg', 'chuka-don': 'chuka-don.jpg',
    'mapo': 'mapo.jpg', 'subuta': 'subuta.jpg', 'hoikoro': 'hoikoro.jpg', 'ebi-chili': 'shrimp.jpg',
    'karaage': 'karaage.jpg', 'nira-reba': 'nira-reba.jpg', 'daily-lunch': 'lunch.jpg', 'teishoku': 'teishoku.jpg',
    'ramen-set': 'ramen-set.jpg', 'fried-rice-set': 'fried-rice-set.jpg', 'gyoza-set': 'gyoza-set.jpg',
    'course-2600': 'course.jpg', 'course-3800': 'course-3800.jpg'
  };

  // 全端末共通のカテゴリーアコーディオン。
  const menuCategories = [
    { name: '点心', ids: ['gyoza', 'boiled-gyoza', 'spring-roll', 'shumai'] },
    { name: '麺類', ids: ['ramen', 'chashu-men', 'mapo-ramen', 'gomoku-ramen'] },
    { name: 'ご飯もの', ids: ['fried-rice', 'tenshin', 'mapo-don', 'chuka-don'] },
    { name: '一品料理', ids: ['mapo', 'subuta', 'hoikoro', 'ebi-chili', 'karaage', 'nira-reba'] },
    { name: '定食・ランチ', ids: ['daily-lunch', 'teishoku'] },
    { name: 'セットメニュー', ids: ['ramen-set', 'fried-rice-set', 'gyoza-set'] },
    { name: '宴会コース', ids: ['course-2600', 'course-3800'] }
  ];

  const menuList = document.querySelector('.menu-list');
  if (menuList) {
    const cards = new Map([...menuList.querySelectorAll('[data-dish]')].map((card) => [card.dataset.dish, card]));
    const sections = menuCategories.map((category, index) => {
      const section = document.createElement('section');
      section.className = 'menu-accordion';
      const heading = document.createElement('h3');
      const button = document.createElement('button');
      const panel = document.createElement('div');
      const panelId = `menu-category-${index + 1}`;

      button.type = 'button';
      button.className = 'menu-category-button';
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-controls', panelId);
      button.innerHTML = `<span>${category.name}</span><small>${category.ids.length}品</small>`;
      panel.className = 'menu-category-panel';
      panel.id = panelId;
      panel.hidden = true;
      category.ids.forEach((id) => cards.get(id) && panel.append(cards.get(id)));

      button.addEventListener('click', () => {
        const open = button.getAttribute('aria-expanded') !== 'true';
        button.setAttribute('aria-expanded', String(open));
        panel.hidden = !open;
      });
      heading.append(button);
      section.append(heading, panel);
      return section;
    });
    menuList.replaceChildren(...sections);

    // 769px以上では全料理を常時表示し、スマホだけ開閉状態を反映します。
    const mobileMenuQuery = window.matchMedia('(max-width: 768px)');
    const syncMenuMode = () => {
      menuList.querySelectorAll('.menu-category-button').forEach((button) => {
        const panel = document.getElementById(button.getAttribute('aria-controls'));
        if (!panel) return;
        panel.hidden = mobileMenuQuery.matches
          ? button.getAttribute('aria-expanded') !== 'true'
          : false;
      });
    };
    syncMenuMode();
    if ('addEventListener' in mobileMenuQuery) {
      mobileMenuQuery.addEventListener('change', syncMenuMode);
    } else {
      mobileMenuQuery.addListener(syncMenuMode);
    }
  }

  document.querySelectorAll('[data-dish]').forEach((item, index) => {
    const id = item.dataset.dish;
    const dishName = item.querySelector('span')?.textContent || '料理';
    const panelId = `allergy-${index + 1}`;
    const photo = document.createElement('div');
    photo.className = 'menu-item-photo';
    const image = document.createElement('img');
    image.src = `images/${menuImages[id] || 'hero.jpg'}`;
    image.alt = `${dishName}のイメージ`;
    image.loading = 'lazy';
    image.width = 520;
    image.height = 360;
    photo.append(image);
    item.prepend(photo);

    const details = document.createElement('div');
    details.className = 'allergy-details';
    details.id = panelId;
    details.hidden = true;

    const values = allergyData[id] || ['店舗へご確認ください'];
    details.innerHTML = `<strong>${dishName}のアレルギー情報</strong><ul>${values.map((value) => `<li>${value}</li>`).join('')}</ul>`;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'allergy-button';
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', panelId);
    button.textContent = 'アレルギー表示を見る';
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      button.textContent = open ? 'アレルギー表示を閉じる' : 'アレルギー表示を見る';
      details.hidden = !open;
    });
    item.append(button, details);
  });

  // 軽量なスクロールフェードイン。
  const targets = document.querySelectorAll('.fade');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((target) => target.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver((entries, instance) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        instance.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -25px' });
    targets.forEach((target) => observer.observe(target));
  }
})();
