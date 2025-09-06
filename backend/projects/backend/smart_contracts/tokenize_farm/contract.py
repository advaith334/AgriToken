from algopy import ARC4Contract, String, UInt64, GlobalState, Account, Txn
from algopy.arc4 import abimethod


class TokenizeFarm(ARC4Contract):
    # Global state variables
    farm_name: GlobalState[String]
    asset_id: GlobalState[UInt64]
    total_tokens_minted: GlobalState[UInt64]
    is_initialized: GlobalState[bool]
    owner: GlobalState[Account]
    
    def __init__(self) -> None:
        self.farm_name = GlobalState(String)
        self.asset_id = GlobalState(UInt64)
        self.total_tokens_minted = GlobalState(UInt64)
        self.is_initialized = GlobalState(bool)
        self.owner = GlobalState(Account)
    
    @abimethod()
    def initialize_farm(
        self,
        farm_name: String,
        asset_id: UInt64
    ) -> String:
        """Initialize the farm tokenization with farm data and asset information"""
        assert not self.is_initialized.value, "Farm already initialized"
        
        # Store farm information
        self.farm_name.value = farm_name
        self.asset_id.value = asset_id
        self.owner.value = Txn.sender
        self.is_initialized.value = True
        self.total_tokens_minted.value = UInt64(0)
        
        return String("Farm tokenization initialized successfully")
    
    @abimethod()
    def get_farm_name(self) -> String:
        """Get farm name"""
        assert self.is_initialized.value, "Farm not initialized"
        return self.farm_name.value
    
    @abimethod()
    def get_asset_id(self) -> UInt64:
        """Get asset ID"""
        assert self.is_initialized.value, "Farm not initialized"
        return self.asset_id.value
    
    @abimethod()
    def get_total_minted(self) -> UInt64:
        """Get total tokens minted"""
        assert self.is_initialized.value, "Farm not initialized"
        return self.total_tokens_minted.value
    
    @abimethod()
    def get_owner(self) -> Account:
        """Get contract owner"""
        assert self.is_initialized.value, "Farm not initialized"
        return self.owner.value
    
    @abimethod()
    def update_farm_name(self, new_farm_name: String) -> String:
        """Update farm name (only owner)"""
        assert self.is_initialized.value, "Farm not initialized"
        assert Txn.sender == self.owner.value, "Only owner can update farm name"
        
        self.farm_name.value = new_farm_name
        return String("Farm name updated successfully")
    
    @abimethod()
    def hello(self, name: String) -> String:
        """Legacy hello method for testing"""
        return String("Hello, ") + name
