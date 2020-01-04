const puppeteer = require("puppeteer");


async function main() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("http://www.freecollocation.com/search?word=search", {
    waitUntil: "domcontentloaded"
  });
  const div = await page.waitForSelector("div.item", { visible: true });
  let result = await div.$$eval("p", els => {
    let data = {};
    let sections = [];
    let content = {};
    els.forEach(el => {
      if (el.className == "word") {
        data.word = el.querySelector("b").innerText;
        data.pos = el.querySelector("i").innerText;
      } else if (el.querySelector("b")) {

        let section = {};

        let pos = el.querySelector('u').innerText;
        let collocations = Array.from(el.querySelectorAll("b")).map(
          el => el.innerText
        );
        let examples = Array.from(el.querySelectorAll("i")).map(el => el.innerText);
          
        section.pos = pos;
        section.collocations = collocations;
        section.examples = examples;
        
        sections.push(section);
      }
    });
    content.sections = sections;
    data.content = content;
    return data;
  });
  console.log(JSON.stringify(result, null, 4));
  await browser.close();
}

main();