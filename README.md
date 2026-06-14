# Dreamina @img Reference Helper

# Dreamina @img Reference Helper

A lightweight Chrome extension that converts `@img1`, `@img2`, `@img3`, etc. placeholders into Dreamina reference image selections, including workflows where Seedance is accessed through Dreamina.

## ⚠️ Warning

This extension is experimental.

It uses keyboard automation to interact with Dreamina. If focus is lost while running, unintended actions may occur, including repeated video generations.

Avoid:

- Switching tabs
- Minimizing the browser
- Using the keyboard while running
- Pressing ESC during execution

If something goes wrong:

1. Click inside the prompt editor.
2. Delete the prompt.
3. Cancel any unwanted generations.

Use at your own risk.

---

## Installation

The extension contains only two files:

```text
content.js
manifest.json
```

### Load into Chrome

1. Open:

```text
chrome://extensions
```

2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the folder containing:

```text
content.js
manifest.json
```

5. Open Dreamina

The **Fix @img** button should appear automatically.

---

## Usage

Example:

```text
Use @img1 as environment reference.
Use @img2 as character reference.
Use @img3 as pose reference.
```

Click:

```text
Fix @img
```

The extension will replace references in prompt order.

---

## Limitations

- Depends on Dreamina's current UI
- Focus-sensitive keyboard automation
- May break if Dreamina changes its interface

Contributions and improvements are welcome.
