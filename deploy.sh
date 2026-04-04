#!/bin/bash
set -e

# 1. Build the project
npm run build

# 2. Copy build to ../mterczynski.github.io
rm -rf ../mterczynski.github.io/space-golf-3d-v2
mkdir ../mterczynski.github.io/space-golf-3d-v2
cp -r ./dist/* ../mterczynski.github.io/space-golf-3d-v2/
cd ../mterczynski.github.io

# 3. Commit in ../mterczynski.github.io
git add space-golf-3d-v2
git commit -m "Update space-golf-3d-v2 build"

# 4. Push in ../mterczynski.github.io
git push
