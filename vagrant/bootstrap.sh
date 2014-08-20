#!/usr/bin/env bash

if [ ! -f ~/runonce ]
then

apt-get update
#echo "export LC_CTYPE=\"en_US.UTF-8\"" >> /etc/bash.bashrc

apt-get -y install curl
apt-get -y install make
apt-get -y install g++
apt-get -y install libfontconfig1
apt-get -y install git
apt-get -y install openjdk -7-jre


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

echo "==========Install Tortuga Grunt project dependencies====================="
mkdir /tortuga_grunt_project
cd /tortuga_grunt_project
ln -s /tortuga/grunt_project/package.json
npm install
cp -LR node_modules /tortuga/grunt_project
cd -
rm -rf /tortuga_grunt_project
#cd /tortuga/grunt_project
#npm install
#cd -

touch ~/runonce
fi

