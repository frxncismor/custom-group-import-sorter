<h1 align="center"> Custom Group Import Sorter </h1>

<p align="center"> Sort your imports as custom groups </p>
<p align="center"> In Typescript you can select multiple lines of imports and sort them in groups.</p>

## Install

Click the extension tab and in there search `Custom Group Import Sorter` and install it. Or just go to [Custom Group Import Sorter]().

## How to Use - Configuration

Go to Settings `Custom Group Import Sorter` open `settings.json` and add 3 custom arrays in there put the origin that you want to group.

```
"custom-group-import-sorter.Group1": [
  "@angular/core"
],
"custom-group-import-sorter.Group2": [
  "rxjs",
  "@ngrx/store"
],
"custom-group-import-sorter.Group3": [
  "@library/core",
  "@library/data"
]
```

> [!NOTE]  
> Any library that doesn't exists in the groups will be sorted at the top

## How to Use - Execution
- Select the desired ones.
- Using Command Palette `Cmd+Shift+P` and select `Custom Group Import Sorter: Sort`.

Or you can create a shortcut for this command in Keyboard Shortcuts in VS Code.

## License

MIT © [Frxncismor](https://github.com/frxncismor)

---

### Code Inspiration
[custom-css-sorter](https://github.com/nacho87/custom-css-sorter)
