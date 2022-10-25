# Dye Li Link in Bio

- Simple link in bio page *(or even multiple)*
- Short URL generator
- URL Redirector

## `package.json`

### `homepage`

This is used for the copy to clipboard function of `links/add.js`

### `config`

Configuration in this is used for `links/add.js`. Configure per requirements.

### `optionalDependencies`

- `serve`: handy for testing the HTML pages without needing to run the worker.
- `wrangler`: in case it isn't installed globally.

Use `npm install --omit=optional` to skip.

## Add Redirect URL

Run `node links/add [URL]` or `node links/add [URL] [CODE]`. This adds a new key/value to `links/link-list.json`. Disable a link *(without removing it)* by appending a `!` to the beginning of the key. These values are skipped when `links/filter-links.js` builds `redirects.json` for the worker.

## Bio Page

Bio page uses Markdown and layout uses Nunjucks for easy templating.

## License

[Jam License](LICENSE)
