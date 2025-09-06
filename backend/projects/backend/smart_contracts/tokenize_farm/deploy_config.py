import logging
import json
import os
from pathlib import Path

import algokit_utils

logger = logging.getLogger(__name__)


def load_farm_data() -> dict:
    """Load farm data from the JSON file"""
    farm_data_path = Path(__file__).parent.parent.parent / "data" / "farm_info" / "langs_farm.json"
    
    if not farm_data_path.exists():
        logger.warning(f"Farm data file not found at {farm_data_path}")
        return {}
    
    try:
        with open(farm_data_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading farm data: {e}")
        return {}


def create_farm_info_from_data(farm_data: dict):
    """Create FarmInfo object from farm data"""
    from smart_contracts.artifacts.tokenize_farm.tokenize_farm_client import FarmInfo
    
    return FarmInfo(
        farm_name=farm_data.get("Farm Name", ""),
        farm_website=farm_data.get("Farm Website", ""),
        farm_email=farm_data.get("Farm Email", ""),
        farm_phone=farm_data.get("Farm Phone", ""),
        farmer_name=farm_data.get("Farmer Name", ""),
        wallet_address=farm_data.get("Wallet Address", ""),
        farm_size_acres=farm_data.get("Farm Size (Acres)", 0),
        crop_type=farm_data.get("Crop Type", ""),
        farm_location=farm_data.get("Farm Location", ""),
        number_of_tokens=farm_data.get("Number of Tokens", 100),
        token_name=farm_data.get("Token Name", ""),
        token_unit=farm_data.get("Token Unit", ""),
        price_per_token_usd=farm_data.get("Price per Token (USD)", 0),
        expected_yield_per_unit=farm_data.get("Expected Yield /unit", 0),
        harvest_date=farm_data.get("Harvest Date", ""),
        payout_method=farm_data.get("Payout Method", ""),
        insurance_enabled=farm_data.get("Insurance Enabled", False),
        insurance_type=farm_data.get("Insurance Type", ""),
        verification_method=farm_data.get("Verification Method", ""),
        local_currency=farm_data.get("Local Currency", "")
    )


# define deployment behaviour based on supplied app spec
def deploy() -> None:
    from smart_contracts.artifacts.tokenize_farm.tokenize_farm_client import (
        HelloArgs,
        TokenizeFarmFactory,
    )

    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer_ = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        TokenizeFarmFactory, default_sender=deployer_.address
    )

    app_client, result = factory.deploy(
        on_update=algokit_utils.OnUpdate.AppendApp,
        on_schema_break=algokit_utils.OnSchemaBreak.AppendApp,
    )

    if result.operation_performed in [
        algokit_utils.OperationPerformed.Create,
        algokit_utils.OperationPerformed.Replace,
    ]:
        algorand.send.payment(
            algokit_utils.PaymentParams(
                amount=algokit_utils.AlgoAmount(algo=1),
                sender=deployer_.address,
                receiver=app_client.app_address,
            )
        )

    # Test the hello method
    name = "world"
    response = app_client.send.hello(args=HelloArgs(name=name))
    logger.info(
        f"Called hello on {app_client.app_name} ({app_client.app_id}) "
        f"with name={name}, received: {response.abi_return}"
    )
    
    # Load farm data and initialize if available
    farm_data = load_farm_data()
    if farm_data:
        logger.info("Farm data found, contract is ready for initialization")
        logger.info(f"Farm: {farm_data.get('Farm Name', 'Unknown')}")
        logger.info(f"Token: {farm_data.get('Token Name', 'Unknown')}")
        logger.info(f"Total Tokens: {farm_data.get('Number of Tokens', 0)}")
    else:
        logger.info("No farm data found, contract deployed but not initialized")
