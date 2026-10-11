// Confere as cópias locais no Chromium: altura, estouro horizontal, fontes e retratos.
// uso: node qa.js <dir local> <dir saída> [pagina ...]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const fs = require('fs');
const [,, dirLocal, dirOut, ...soEstas] = process.argv;
const paginas = (soEstas.length ? soEstas : ['inicio', 'area', 'escritorio', 'situacao', 'resposta']);
const larguras = [1440, 390];
(async () => {
  fs.mkdirSync(dirOut, { recursive: true });
  const browser = await chromium.launch({ args: ['--headless=new'] });
  const alturas = {};
  for (const p of paginas) {
    alturas[p] = {};
    for (const w of larguras) {
      const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const erros = [];
      page.on('pageerror', (e) => erros.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') erros.push(m.text()); });
      await page.goto('file://' + path.join(dirLocal, p + '.html'), { waitUntil: 'load' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const info = await page.evaluate(() => {
        const r = document.querySelector('.site');
        const h = Math.ceil(r.getBoundingClientRect().height);
        const estouro = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const fontes = {
          playfair: document.fonts.check('500 40px "Playfair Display"'),
          playfairIt: document.fonts.check('italic 500 40px "Playfair Display"'),
          inter: document.fonts.check('400 16px Inter'),
        };
        const larg = [];
        document.querySelectorAll('.site *').forEach((el) => {
          const b = el.getBoundingClientRect();
          if (b.right > document.documentElement.clientWidth + 1 && b.width > 0) larg.push(el.tagName.toLowerCase() + '.' + (el.className && el.className.baseVal === undefined ? String(el.className).split(' ')[0] : ''));
        });
        return { h, estouro, fontes, larg: larg.slice(0, 8) };
      });
      alturas[p][String(w)] = info.h;
      console.log(p, w, 'altura', info.h, 'estouro', info.estouro, JSON.stringify(info.fontes), info.larg.length ? 'FORA: ' + info.larg.join(', ') : '', erros.length ? 'ERROS: ' + erros.join(' | ') : '');
      await page.screenshot({ path: path.join(dirOut, `${p}-${w}.png`), fullPage: true });
      await ctx.close();
    }
  }
  fs.writeFileSync(path.join(dirOut, 'heights.json'), JSON.stringify(alturas, null, 2));
  await browser.close();
})();
