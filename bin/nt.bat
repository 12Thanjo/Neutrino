@echo off
set dirname=%cd%
cd "../"
node neutrino.js "%dirname%" %*