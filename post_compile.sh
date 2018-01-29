#!/bin/sh

echo ">>>> HERE"
pwd
ls -l
(cd ./apps/central/assets && npm install)
(cd ./apps/company/assets && npm install)
