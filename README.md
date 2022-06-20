# cryptography_basics

Javascript implementation of <a href="https://github.com/kr/fernet-spec">Fernet symmetric encryption</a>.

Python fernet cryptography.


## INSTRUCTIONS FOR NODEJS EXECUTION

1) Paste the elements of https://github.com/DanielFranco-NEUenergy/fernet.js, except yarn files, fernetBrowser.js, and Readme.md

2) yarn init

3) yarn add crypto-js

4) yarn add fernet

5) In case zipurl is installed, remove "type": "module", from package.json of the /nodemodules/zipurl/ folder

6) In fernet.js Change new Buffer(s) to new Buffer.from(s) , so that decode64() be:
// convert base64 string to hex string
var decode64toHex = function decode64(string) {
  var s = URLBase64.decode(string.replace(/=+$/, ''));
  return (new Buffer.from(s)).toString('hex');
}