#!/bin/bash
export DISPLAY=:1;
export LD_LIBRARY_PATH=/opt/google/chrome/lib
cd /home/protractor/suites/pr
sudo -u protractor DISPLAY=:1 LD_LIBRARY_PATH=/opt/google/chrome/lib protractor protractor.config.js
