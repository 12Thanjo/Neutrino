@echo off
set dirname=%cd%
rem cd "../"
node "%~dp0../neutrino.js" "%dirname%" %*
