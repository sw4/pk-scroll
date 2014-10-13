#!/bin/bash
rm -rf out || exit 0;
mkdir out; 
node build.js
( cd out
 git init
 git config user.name "Travis-CI"
 git config user.email "travis@travis.com"
 cp ../CNAME ./CNAME
 cp ../pk-scroll.js ./pk-scroll.js
 git add .
 git commit -m "Deployed to Github"
 git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:master > /dev/null 2>&1
)
