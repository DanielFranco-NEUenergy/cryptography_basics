var fernet = require('./fernet');

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
 * @param: innerKey := the inner key to transfer to the receiver of the token
 */
var innerKey = newId()

console.log('\n',"INNER KEY: ")
console.log("innerKey: ", innerKey)

var innerSecret = new fernet.Secret(innerKey);
/*
    {
      signingKeyHex: '...',
      signingKey: [CryptoJS.lib.WordArray],
      encryptionKeyHex: '...',
      encryptionKey: [CryptoJS.lib.WordArray]
    }
  */


/**
 * Encryption layer 1
 */
//Have to include time and iv to make it deterministic.
//Normally time would default to (new Date()) and iv to something random.
var innerToken = new fernet.Token({
    /**
     * @param: innerToken.token := the encrypted message for layer 1
     */
    secret: innerSecret,
    //time: new Date(),                                     // apparently time is irrelevant, TEST IT
    //iv: _crypto.getRandomValues(new Uint8Array(16)),      // apparently iv is irrelevant, TEST IT. Default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    //ttl: Math.random() * 10 + 1                           // apparently, ttl is irrelevant, TEST IT
  });

console.log("innerSecret: ", innerToken.secret)
//console.log("signingKeyHex: ", token.secret.signingKeyHex)
//console.log("encryptionKeyHex: ", token.secret.encryptionKeyHex, '\n')

innerToken.encode(initialMessage);

console.log('\n',"INNER ENCRYPTION: ")
console.log("innerToken: ", innerToken.token)
//console.log("ttl: ", innerToken.ttl)
//console.log("iv: ", innerToken.iv)
//console.log("ivHex: ", innerToken.ivHex)
//console.log("time: ", innerToken.time, '\n')

/**
 * @param: outerKey := the inner key to transfer to the receiver of the token
 */
 var outerKey = newId()

 console.log('\n',"OUTER KEY: ")
 console.log("outerKey: ", outerKey)

 var outerSecret = new fernet.Secret(outerKey);

 /**
 * Encryption layer 2
 */
 var outerToken = new fernet.Token({
  /**
   * @param: outerToken.token := the encrypted message in layer 2; the message to be transmitted
   */
  secret: outerSecret,
  //time: new Date(),                                     // apparently time is irrelevant, TEST IT
  //iv: _crypto.getRandomValues(new Uint8Array(16)),      // apparently iv is irrelevant, TEST IT. Default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  //ttl: Math.random() * 10 + 1                           // apparently, ttl is irrelevant, TEST IT
});

outerToken.encode(innerToken.token);      // In layer 2, the encrypted message of layer 1 is encrypted

console.log('\n',"OUTER ENCRYPTION: ")
console.log("outerToken: ", outerToken.token)


/**
 * Decryption outer layer
 */
var outer_token_decoded = new fernet.Token({
  secret: new fernet.Secret(outerKey),
  token: outerToken.token,
  //ttl: token.ttl,       // apparently, ttl is irrelevant, TEST IT
  //iv: token.iv          // apparently iv is irrelevant, TEST IT. Default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
})
outer_token_decoded.decode();

console.log('\n',"OUTER DECRYPTION: ")
console.log("outer_token_decoded: ", outer_token_decoded.message)

/**
 * Decryption inner layer
 */
 var inner_token_decoded = new fernet.Token({
  secret: new fernet.Secret(innerKey),
  token: innerToken.token,
  //ttl: token.ttl,       // apparently, ttl is irrelevant, TEST IT
  //iv: token.iv          // apparently iv is irrelevant, TEST IT. Default: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
})
inner_token_decoded.decode();       // The original message

console.log('\n',"INNER DECRYPTION: ")
console.log("inner_token_decoded: ", inner_token_decoded.message)

