let get_items = sel => {
  //[div.item,div.item,...]
  let items = document.querySelectorAll(sel);
  return Array.from(items);
};

//[[p.word,p,p,p,...],[p.word,p,p,...]]
let get_ps = items => items.map(div => Array.from(div.querySelectorAll("p")));

let get_wordMeta = p => {
  //['card','noun']
  if (p.className == "word") {
    let word = p.querySelector("b").innerText;
    let word_pos = p.querySelector("i").innerText;
    return [word, word_pos];
  }
};

let get_IndexofSense = ps => {
  // [number,number,number,...]
  return ps
    .map(p => {
      if (p.querySelector(":first-child").tagName == "SUP") {
        return ps.indexOf(p);
      }
    })
    .filter(index => index);
};

let get_ArrayofSense = (ps, is) => {
  //[[p,p,p],[p,p],[p,p,p,p]...]
  //is => index
  let arr = [];
  is.reduce((i, j) => {
    arr.push(ps.slice(i, j));
    return j;
  });
  arr.push(ps.slice(is[is.length - 1]));
  return arr;
};

let get_sense = ps => {
  //in this case the ps is short
  return ps.slice(1).map(col => {
    let pos = col.querySelector("u").innerText;
    let contextual_words = Array.from(col.querySelectorAll("b")).map(
      i => i.innerText
    );
    let examples = Array.from(col.querySelectorAll("i")).map(i => i.innerText);
    return {
      meaning: ps[0].hasAttribute('class') ? null : ps[0].innerText,
      pos: pos,
      collocations: contextual_words,
      examples: examples
    };
  });
};

function main() {
  let items = get_items(document);
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
}
