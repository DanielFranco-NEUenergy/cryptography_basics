## https://www.youtube.com/watch?v=bE7fl6qN-LY

from cryptography.fernet import Fernet
from binascii import unhexlify

'''
Initial message

message := original message (a string)
message_bytes := original message encoded in bytes
'''
message = "Hello"
message_bytes = message.encode()
print("message: ", message)
print("message_bytes: ", message_bytes, '\n')

'''
Cryptographic key generation

key := the original generated key in bytes ; TODO: see if it can be passed as such to the locksmith smart contract
key_hex := the key in hex format (for python hex is a string) ; this is stored by the locksmith smart contract
'''
key = Fernet.generate_key()
key_hex = key.hex()
print("key: ", key)
print("key_hex: ", key_hex, '\n')

'''
Encryption

token := encrypted message in bytes
token_hex := encrypted bytes message presented in hex format; TODO: see whether it is better to send token_hex or token from the IoT to the customers' servers
'''
fernet_obj = Fernet(key)                    ## TODO: study https://cryptography.io/en/latest/fernet/
token = fernet_obj.encrypt(message_bytes)                                                               ## always has the == sign at the end
token_hex = token.hex()
print("token: ", token, '\n', type(token))
print("token_hex: ", token_hex, '\n', type(token_hex),'\n')

'''
Parenthesis about hex to bytes conversion in python

token_recovered1, token_recovered2 := recovered token in bytes using two methods
'''
token_recovered1 = bytes.fromhex(token_hex)     ## must be equal to token
token_recovered2 = unhexlify(token_hex)
print("Parenthesis ---> token_recovered1: ", token_recovered1, type(token_recovered1))
print("Parenthesis ---> token_recovered2: ", token_recovered2, type(token_recovered2),'\n')

'''
Decryption

unwrapped_token := the original message (in bytes) recovered, that is to say, the token decrypted on the customers' servers
message_on_the_other_side := the original string message on the customers' servers
'''
unwrapped_token = fernet_obj.decrypt(token)
message_on_the_other_side = unwrapped_token.decode()
print("unwrapped_token: ", unwrapped_token)
print("message_on_the_other_side: ", message_on_the_other_side, '\n')

