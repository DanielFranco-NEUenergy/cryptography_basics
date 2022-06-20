var fernet = require('./fernet');

/** 
 * LESS SECURE KEY GENERATION:
 * 
function makeid(length) {
  // makes random strings
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

const { zipurl } = require('zipurl')
var secret64_key = zipurl(makeid(12));     // 32 url-safe base64-encoded bytes
console.log("secret64_key: ", secret64_key)
*
*/


let _crypto/*  w w   w.   d e    m o  2   s .  c  o  m */
try {
    _crypto = crypto
} catch (error) {
    _crypto = require('crypto').webcrypto
}

/** 
Generating appropriate secrets is beyond the scope of `Fernet`, but you should
generate it using `/dev/random` in a *nix. To generate a base64-encoded 256 bit
(32 byte) random sequence like "cw_0x689RpI-jtRR7oE8h_eQsKImvJapLeSbXpwF4e4=", try:

dd if=/dev/urandom bs=32 count=1 2>/dev/null | openssl base64
*/
function newId() {
  // Get random string with 32 bytes secure randomness, a 32 'url-safe' base64-encoded bytes
  var crypto = require('crypto');
  var id = crypto.randomBytes(32).toString('base64');
  // Make URL safe
  return id;      // .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Initial Message
 */
var initialMessage = "This is a very long message, actually, not a hello world!"

console.log("INITIAL MESSAGE: ")
console.log("initialMessage: ", initialMessage)

/**
 * @param: secret64_key := the primordial key to transfer to the receiver of the token
 */
var secret64_key = newId()

console.log('\n',"KEY: ")
console.log("secret64_key: ", secret64_key)

var secret = new fernet.Secret(secret64_key);
/*
    {
      signingKeyHex: '...',
      signingKey: [CryptoJS.lib.WordArray],
      encryptionKeyHex: '...',
      encryptionKey: [CryptoJS.lib.WordArray]
    }
  */


/**
 * Encryption
 */
//Have to include time and iv to make it deterministic.
//Normally time would default to (new Date()) and iv to something random.
var token = new fernet.Token({
    /**
     * @param: token.token := the encrypted message
     */
    secret: secret,
    //time: new Date(),                                     // apparently time is irrelevant, TEST IT
    //iv: _crypto.getRandomValues(new Uint8Array(16)),      // apparently iv is irrelevant, TEST IT. Default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    //ttl: Math.random() * 10 + 1                           // apparently, ttl is irrelevant, TEST IT
  });

console.log("Secret: ", token.secret)
//console.log("signingKeyHex: ", token.secret.signingKeyHex)
//console.log("encryptionKeyHex: ", token.secret.encryptionKeyHex, '\n')

token.encode(initialMessage);

console.log('\n',"ENCRYPTION: ")
console.log("Token: ", token.token)
//console.log("ttl: ", token.ttl)
//console.log("iv: ", token.iv)
//console.log("ivHex: ", token.ivHex)
//console.log("time: ", token.time, '\n')


/**
 * Decryption
 */
var token_decoded = new fernet.Token({
  secret: new fernet.Secret(secret64_key),
  token: token.token,
  //ttl: token.ttl,       // apparently, ttl is irrelevant, TEST IT
  //iv: token.iv          // apparently iv is irrelevant, TEST IT. Default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
})
token_decoded.decode();

console.log('\n',"DECRYPTION: ")
console.log("token_decoded: ", token_decoded.message)

