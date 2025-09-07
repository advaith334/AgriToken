from algopy import ARC4Contract, String, UInt64, Asset, Txn, Global
from algopy.arc4 import abimethod

class FarmTokenization(ARC4Contract):
    
    # tokenization of farm asset
    @abimethod()
    def tokenize_farm(self, farm_name: String, token_number: UInt64, unit_name: String) -> String:
        return farm_name
    
    # get farm info
    @abimethod()
    def get_farm_info(self) -> String:
        return String("Farm Tokenization Contract - Ready for asset creation")
