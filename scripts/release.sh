#  Copyright 2024 Esri
#
#  Licensed under the Apache License Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
# 
#      http://www.apache.org/licenses/LICENSE-2.0
# 
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.

#!/bin/bash

# config
VERSION=$(node --eval "console.log(require('./package.json').version);")
NAME=$(node --eval "console.log(require('./package.json').name);")

# build and test
npm run test || exit 1

# run build
npm run build

# Integrity string and save to siteData.json
JS_INTEGRITY=$(cat dist/esri-leaflet-static-basemap-tile.js | openssl dgst -sha512 -binary | openssl base64 -A)
echo "{\"name\": \"esri-leaflet-static-basemap-tile\",\"version\": \"$VERSION\",\"lib\": {\"path\": \"dist/esri-leaflet-static-basemap-tile.js\",\"integrity\": \"sha512-$JS_INTEGRITY\"}}" > dist/siteData.json

# checkout temp branch for release
git checkout -b gh-release

# force add files
git add dist -f

# commit changes with a versioned commit message
git commit -m "build $VERSION"

# push commit so it exists on GitHub when we run gh-release
git push git@github.com:Esri/esri-leaflet-static-basemap-tile.git gh-release

# create a ZIP archive of the dist files
# for Windows users it is recommended to create the archive manually instead
zip -r $NAME-v$VERSION.zip dist

# run gh-release to create the tag and push release to github
# may need to run this instead on Windows: ./node_modules/.bin/gh-release --assets $NAME-v$VERSION.zip
gh-release --assets $NAME-v$VERSION.zip

# publish release on NPM
npm publish

# checkout master and delete release branch locally and on GitHub
git checkout main
git branch -D gh-release
git push git@github.com:Esri/esri-leaflet-static-basemap-tile.git :gh-release
