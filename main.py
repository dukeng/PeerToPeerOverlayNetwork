

from stellar_base.keypair import Keypair
from pprint import pprint
from stellar_base.address import Address

from stellar_base.builder import Builder

import requests 


class Stellar:

    def __init__(self, name="test"):
        self.generateKeyPair()
        self.setKeys()
        self.name = name

    def generateKeyPair(self):
        self.kp = Keypair.random()

    def setKeys(self):
        self.publickey = self.kp.address().decode()
        self.seed = self.kp.seed().decode()

        r = requests.get('https://friendbot.stellar.org/?addr=' + self.publickey)
        print("Public Key:", self.publickey)

    def checkBalance(self):
        address = Address(address=self.publickey) # address = Address(address=publickey,network='public') for livenet
        address.get() # get the updated information
        pprint("Balances: {}".format(address.balances))
        pprint("Sequence Number: {}".format(address.sequence))
        pprint("Flags: {}".format(address.flags))
        pprint("Signers: {}".format(address.signers))
        pprint("Data: {}".format(address.data))

    def sendTransaction(self, receiverAddress, amount, message='Test'):
        builder = Builder(secret=self.seed)
        builder.append_payment_op(receiverAddress, amount, 'XLM')
        builder.add_text_memo(message)
        builder.sign()
        builder.submit()



if __name__ == "__main__":
    myStellar = Stellar()
    myStellar.checkBalance()
    

    yourStellar = Stellar()
    yourStellar.checkBalance()
    
    #Send a transaction
    receiverAddress = yourStellar.publickey
    print("receiverAddress", receiverAddress)
    myStellar.sendTransaction(receiverAddress, '100', "HelloWorld")

    myStellar.checkBalance()

    yourStellar.checkBalance()
