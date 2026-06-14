console.clear();
console.log("=== DREAMINA HELPER RESTORED WORKING v1.1 ===");

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getEditor() {
  return [...document.querySelectorAll(".tiptap.ProseMirror")]
    .filter(el => el.offsetParent !== null)
    .find(el => /@img\d*\b/.test(el.innerText));
}

function pressKey(target, key) {
  const map = {
    ArrowDown: { code: "ArrowDown", keyCode: 40 },
    Enter: { code: "Enter", keyCode: 13 }
  };

  const info = map[key];

  ["keydown", "keypress", "keyup"].forEach(type => {
    const ev = new KeyboardEvent(type, {
      key,
      code: info.code,
      keyCode: info.keyCode,
      which: info.keyCode,
      bubbles: true,
      cancelable: true,
      composed: true
    });

    target.dispatchEvent(ev);
    document.dispatchEvent(ev);
    window.dispatchEvent(ev);
  });
}

function getRequestedRefs(text) {
  return [...text.matchAll(/@img(\d*)\b/g)].map(match => {
    const number = match[1] ? Number(match[1]) : 1;

    return {
      token: match[0],
      number,
      index: number - 1
    };
  });
}

function validateSequence(refs) {
  const numbers = [...new Set(refs.map(r => r.number))]
    .sort((a, b) => a - b);

  const max = Math.max(...numbers);

  for (let i = 1; i <= max; i++) {
    if (!numbers.includes(i)) {
      return {
        ok: false,
        message:
          `Promptta @img${i} eksik.\n\n` +
          `@img numaraları 1'den başlayıp sırayla gitmeli.`
      };
    }
  }

  return { ok: true, max };
}

async function replaceToken(editor, token, itemIndex) {
  const walker = document.createTreeWalker(
    editor,
    NodeFilter.SHOW_TEXT
  );

  let node;

  while ((node = walker.nextNode())) {

    const index = node.nodeValue.indexOf(token);

    if (index === -1) continue;

    const range = document.createRange();

    range.setStart(node, index);
    range.setEnd(node, index + token.length);

    const sel = window.getSelection();

    sel.removeAllRanges();
    sel.addRange(range);

    const scrollTarget =
      node.parentElement ||
      range.startContainer.parentElement;

    if (scrollTarget) {

      scrollTarget.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest"
      });

      await sleep(900);
    }

    editor.focus();

    await sleep(300);

    document.execCommand(
      "insertText",
      false,
      "@"
    );

    await sleep(1500);

    editor.focus();

    for (let i = 0; i < itemIndex; i++) {

      pressKey(editor, "ArrowDown");

      await sleep(300);
    }

    await sleep(400);

    pressKey(editor, "Enter");

    await sleep(1000);

    return true;
  }

  return false;
}

async function runAll() {

  const editor = getEditor();

  if (!editor) {
    alert(
      "@img içeren görünür prompt kutusu bulunamadı."
    );
    return;
  }

  const refs =
    getRequestedRefs(editor.innerText);

  if (!refs.length) {
    alert("@img token bulunamadı.");
    return;
  }

  const validation =
    validateSequence(refs);

  if (!validation.ok) {

    alert(
      validation.message +
      "\n\nHiçbir değişiklik yapılmadı."
    );

    return;
  }

  const availableCount = Number(
    prompt("Kaç ref görsel ekledin?")
  );

  if (!availableCount || availableCount < 1) {

    alert(
      "Geçerli ref görsel sayısı girilmedi. İşlem yapılmadı."
    );

    return;
  }

  if (validation.max !== availableCount) {

    alert(
      `Prompt @img${validation.max}'e kadar gidiyor ama ${availableCount} ref görsel girdin.\n\n` +
      `Ekli görsel sayısı ile prompttaki @img sayısı birebir eşleşmeli.\n\n` +
      `Hiçbir değişiklik yapılmadı.`
    );

    return;
  }

  editor.focus();

  editor.style.outline =
    "3px solid lime";

  while (true) {

    const currentRefs =
      getRequestedRefs(editor.innerText);

    if (!currentRefs.length) {
      break;
    }

    const nextRef =
      currentRefs[0];

    const ok =
      await replaceToken(
        editor,
        nextRef.token,
        nextRef.index
      );

    if (!ok) {
      break;
    }
  }

  alert("Done");
}

function addButton() {

  if (
    document.getElementById(
      "dreamina-img-helper-btn"
    )
  ) return;

  const btn =
    document.createElement("button");

  btn.id =
    "dreamina-img-helper-btn";

  btn.textContent =
    "Fix @img v1.1";

  btn.style.position = "fixed";
  btn.style.top = "80px";
  btn.style.right = "20px";
  btn.style.zIndex = "999999";

  btn.style.padding = "10px 14px";

  btn.style.borderRadius = "10px";

  btn.style.background = "#00ff99";

  btn.style.color = "#000";

  btn.style.fontWeight = "bold";

  btn.style.border = "none";

  btn.style.cursor = "pointer";

  btn.onclick = runAll;

  document.body.appendChild(btn);
}

setInterval(addButton, 1500);
