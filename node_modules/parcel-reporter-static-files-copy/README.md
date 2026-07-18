# parcel-reporter-static-files-copy

ParcelJS v2 plugin to copy static files from some directory to output dir. There is no watcher -
files are copied on the build finish.

## Install

```
yarn add parcel-reporter-static-files-copy --dev
```

```
npm install -D parcel-reporter-static-files-copy
```

## Usage

1. Create a `static` directory in your project root.
2. Fill it with your static files
3. Add plugin to `.parcelrc`:

```
{
  "extends": ["@parcel/config-default"],
  "reporters":  ["...", "parcel-reporter-static-files-copy"]
}
```

PLEASE NOTE: `"..."` is not a placeholder - it is used to extend the default list of
plugins (reporters in this case). Please see
[Parcel's plugins documentation](https://parceljs.org/features/plugins/#plugins) for more information.

4. Run build - and that's all! Files from the `static` directory will end up in `dist`!

## Customization

Beyond the default settings, you can:

1. Name of the directory to be copied.

```json
// package.json
  {
  ...
  "staticFiles": {
    "staticPath": "customStatic"
  }
```

2. Specify a directory to copy static files into

If files from `staticPath` needs to get copied into a subdirectory inside the dist dir -
`staticOutPath` can be used:

```json
// package.json
  {
  ...
  "staticFiles": {
    "staticOutPath": "vendor"
  }
```

3. Destination of static files

The destination of static files can be set in plugin configuration. It will override
`--dist-dir` parameter.

```json
// package.json
  {
  ...
  "staticFiles": {
    "distDir": "customDist"
  }
```

4. Multiple static folders

`staticFiles` entry in `package.json` can be set to the array of configurations instead of a single config. 
Thanks to that it is possible e.g. to copy files from different directories to the output package.

For example please see the example below with environmental variables.

5. Different static files/folders based on the environmental variable

Different static files/folders can be copied based on the environmental variables using `env` map for config.
There can be more than one variable to match - in that case, ALL must be the same.
If `env` map is omitted - file(s) will be always copied.

The example below - when `NODE_ENV` is set to `production` then `production.txt` will be copied and if set to `development` then `development.txt`:

```json
// package.json
  {
  ...
  "staticFiles": [
    {
      "staticPath": "production.txt",
      "env": {
        "NODE_ENV": "production"
      }
    },
    {
      "staticPath": "development.txt",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
```


### Additional example

Check [examples](https://github.com/elwin013/parcel-reporter-static-files-copy/tree/master/examples) directory for
additional examples.

## Flaws and problems

At this moment this plugin copies all static files from some static dir to the output (dist) directory. There is no
watcher on static files - the only trigger is finishing the build (no matter if normal build or serving).

## Contribute

You're interested in contributing? Awesome! Fork, make changes, commit and create pull requests. I'll do my best to merge
changes!

## Thanks and acknowledgement

Special thanks to [@gmougeolle](https://github.com/gmougeolle/).

## License

[MIT](/LICENSE)
