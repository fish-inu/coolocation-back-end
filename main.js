const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const main = async word => {
  const browser = await puppeteer.launch({
    args: ["--proxy-server=127.0.0.1:6666"]
  });
  const page = await browser.newPage();
  await page.goto(`http://www.freecollocation.com/search?word=${word}`, {
    waitUntil: "domcontentloaded"
  });
  const div = await page.waitForSelector("div.item", { visible: true });
  await page.addScriptTag({ path: "utils.js" });
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
          col: [col]
        };
      }
    });
    return result;
  }, "div.item");
  await browser.close();
  return result;
};

const app = express();
app.use(cors());
app.get("/search/:word", async (req, res, next) => {
  let query = req.params.word;
  let result = await main(query);
  res.json(result);
});
app.listen(4000, () => console.log("goku!"));
