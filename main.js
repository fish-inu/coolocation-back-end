const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--proxy-server=127.0.0.1:6666"]
  });
  const page = await browser.newPage();
  await page.goto("http://www.freecollocation.com/search?word=card", {
    waitUntil: "domcontentloaded"
  });
  const div = await page.waitForSelector("div.item", { visible: true });
  await page.addScriptTag({path: 'utils.js'});
  let result = await page.evaluate(selector => {
    let items = get_items(selector);
    let arr_ps = get_ps(items);
    let result = arr_ps.map(ps => {
      let meta = get_wordMeta(ps[0]);
      let index = get_IndexofSense(ps);
      if (index.length != 0) {
        let short_ps = get_ArrayofSense(ps, index);
        let col = short_ps.map(ps => get_sense(ps));
        return {
          meta: meta,
          col: col
        };
      } else {
        let col = get_sense(ps);
        return {
          meta: meta,
          col: col
        };
      }
    });
    return result;
  }, "div.item");
  console.log(JSON.stringify(result, null, 4));
  //await browser.close();s
})();
