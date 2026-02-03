#!/bin/bash

# 1. Build the project
npm run build

# 2. Copy build to ../mterczynski.github.io
rm -rf ../mterczynski.github.io/space-golf-3d
mkdir ../mterczynski.github.io/space-golf-3d
cp -r ./dist/* ../mterczynski.github.io/space-golf-3d/
cd ../mterczynski.github.io

# 3. Commit in ../mterczynski.github.io
git add space-golf-3d
git commit -m "Update space-golf-3d build"

# 4. Push in ../mterczynski.github.io
git push
