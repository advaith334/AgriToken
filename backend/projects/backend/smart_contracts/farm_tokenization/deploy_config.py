import logging
import os
from pathlib import Path

import algokit_utils

logger = logging.getLogger(__name__)

from dotenv import load_dotenv

root_dir = Path(__file__).parent.parent.parent.parent.parent
env_path = root_dir / ".env"

load_dotenv(env_path)


def deploy() -> None:
    from smart_contracts.artifacts.farm_tokenization.farm_tokenization_client import (
        FarmTokenizationFactory,
    )

    algorand = algokit_utils.AlgorandClient.from_environment()
    deployer_ = algorand.account.from_environment("DEPLOYER")

    factory = algorand.client.get_typed_app_factory(
        FarmTokenizationFactory, default_sender=deployer_.address
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

    # Test the tokenize_farm function
    farm_name = "Test Farm"
    token_number = 1000
    unit_name = "TFARM"
    
    response = app_client.send.tokenize_farm(
        args=(farm_name, token_number, unit_name)
    )
    
    logger.info(
        f"Called tokenize_farm on {app_client.app_name} ({app_client.app_id}) "
        f"with farm_name={farm_name}, token_number={token_number}, "
        f"unit_name={unit_name}, response: {response.abi_return}"
    )
    
    # Test get_farm_info function
    info_response = app_client.send.get_farm_info()
    logger.info(f"Farm info: {info_response.abi_return}")
