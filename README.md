## Installing

`$ npm install`

## Running

`DEBUG=walker:error node index --host=http://mysite.com/`

### ARGS
- `--host` Endpoint to walk
- `--start` Path to start walking, defaults to `/`
- `--delay` Timeout in ms to wait between runs, defaults to `1000` (1 second)
- `--concurrency` Number of pages to request at a time, defaults to `2`
- `DEBUG=` Adjust output. `DEBUG=walker:*` `DEBUG=walker:error`
