# Walker

A simple tool to walk a website and report errors

## Installing

`$ npm install`

## Running

`DEBUG=walker:error node index --host=http://mysite.com/`

### ARGS
- `--host` Endpoint to walk
- `--start` Path to start walking, defaults to `/`
- `--delay` Timeout in ms to wait between runs, defaults to `1000` (1 second)
- `--concurrency` Number of pages to request at a time, defaults to `2`
- `--exclude` Comma delimited paths to exclude. Converted to RegExps. Ex: `--exclude /videos/\*,/legal`
- `--max` Cap the number of walks
- `DEBUG=` Adjust output. `DEBUG=walker:*` `DEBUG=walker:error`
