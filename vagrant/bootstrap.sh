#!/usr/bin/env bash

if [ ! -f ~/runonce ]
then

#apt-get update
#echo "export LC_CTYPE=\"en_US.UTF-8\"" >> /etc/bash.bashrc

apt-get -y install curl
apt-get -y install make
apt-get -y install g++


echo "========================Install NodeJS and NPM==========================="
# Different ways to do it without root permissions are described here: 
# https://gist.github.com/isaacs/579814
mkdir ~/node-latest-install
cd ~/node-latest-install
curl http://nodejs.org/dist/node-latest.tar.gz | tar xz --strip-components=1
./configure
make install # ok, fine, this step probably takes more than 30 seconds...
cd -



echo "========================Install GruntJS=================================="
npm install -g grunt-cli

# echo "========================Install NodeUnit================================="
## Description of plugin is here: https://github.com/caolan/nodeunit
# npm install nodeunit -g
## Description https://github.com/gruntjs/grunt-contrib-nodeunit
# npm install grunt-contrib-nodeunit --save-dev

echo "==========Install Tortuga Grunt project dependencies====================="
cd /tortuga/grunt_project
npm install
cd -



touch ~/runonce
fi

