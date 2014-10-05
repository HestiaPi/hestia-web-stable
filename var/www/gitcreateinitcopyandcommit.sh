#!/bin/bash

# Run like that:
# sudo ./gitcreateinitcopyandcommit.sh "<YOUR-COMMIT-COMMENT-HERE>"

if [ $# -eq 0 ]
  then
    echo "Usage: sudo ./gitcreateinitcopyandcommit.sh \"<YOUR-COMMIT-COMMENT-HERE>\""
  else
    mkdir /home/pi/git;
    cd /home/pi/git;
    rm -rf hestia-web-dev;
    mkdir hestia-web-dev;
    cd hestia-web-dev;
    git init;
    git remote add origin https://github.com/gulliverrr/hestia-web-dev.git;
    git pull origin master;
    sudo cp -r /var/www/* var/www/;
    sudo git add var;
    sudo git commit -m "$1";
    git push origin master;
fi
