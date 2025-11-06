#!/bin/bash
npm install
npm run build
cp -r dist/* public_html/
