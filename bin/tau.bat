@echo off
set dirname=%cd%
set dirname=%dirname: =?% 
cd "../"
node tau.js %dirname% %*