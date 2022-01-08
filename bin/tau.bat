@echo off
set dirname=%cd%
rem cd "../"
node "%~dp0../tau.js" "%dirname%" %*
