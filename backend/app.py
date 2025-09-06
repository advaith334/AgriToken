from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import sys
from typing import Dict, List, Optional, Any
import traceback
from datetime import datetime

# Add the smart contracts directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'projects', 'backend', 'smart_contracts'))

# Import the smart contract client
try:
    from tokenize_farm_client import TokenizeFarmClient, TokenizeFarmFactory
    from algokit_utils import AlgorandClient
    ALGORAND_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Algorand dependencies not available: {e}")
    ALGORAND_AVAILABLE = False

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configuration
FARM_DATA_FILE = os.path.join(os.path.dirname(__file__), 'projects', 'backend', 'data', 'farm_info', 'langs_farm.json')

# Algorand configuration (TestNet)
ALGORAND_CONFIG = {
    'algod_token': 'a' * 64,  # TestNet token
    'algod_server': 'https://testnet-api.algonode.cloud',
    'algod_port': 443,
    'indexer_token': 'a' * 64,
    'indexer_server': 'https://testnet-idx.algonode.cloud',
    'indexer_port': 443,
}

# Initialize Algorand client if available
algorand_client = None
if ALGORAND_AVAILABLE:
    try:
        algorand_client = AlgorandClient(
            algod_token=ALGORAND_CONFIG['algod_token'],
            algod_server=ALGORAND_CONFIG['algod_server'],
            algod_port=ALGORAND_CONFIG['algod_port'],
            indexer_token=ALGORAND_CONFIG['indexer_token'],
            indexer_server=ALGORAND_CONFIG['indexer_server'],
            indexer_port=ALGORAND_CONFIG['indexer_port'],
        )
    except Exception as e:
        print(f"Warning: Failed to initialize Algorand client: {e}")
        algorand_client = None

# Helper functions
def load_farm_data() -> List[Dict[str, Any]]:
    """Load farm data from JSON file"""
    try:
        if os.path.exists(FARM_DATA_FILE):
            with open(FARM_DATA_FILE, 'r') as f:
                data = json.load(f)
                return data if isinstance(data, list) else []
        return []
    except Exception as e:
        print(f"Error loading farm data: {e}")
        return []

def save_farm_data(farms: List[Dict[str, Any]]) -> bool:
    """Save farm data to JSON file"""
    try:
        os.makedirs(os.path.dirname(FARM_DATA_FILE), exist_ok=True)
        with open(FARM_DATA_FILE, 'w') as f:
            json.dump(farms, f, indent=2)
        return True
    except Exception as e:
        print(f"Error saving farm data: {e}")
        return False

def validate_farm_data(data: Dict[str, Any]) -> tuple[bool, str]:
    """Validate farm data"""
    required_fields = [
        'Farm Name', 'Farm Website', 'Farm Email', 'Farm Phone',
        'Farmer Name', 'Wallet Address', 'Farm Size (Acres)',
        'Crop Type', 'Farm Location', 'Number of Tokens',
        'Token Name', 'Token Unit', 'Price per Token (USD)',
        'Expected Yield /unit', 'Harvest Date', 'Payout Method',
        'Verification Method'
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return False, f"Missing required field: {field}"

    # Validate numeric fields
    try:
        float(data['Farm Size (Acres)'])
        int(data['Number of Tokens'])
        float(data['Price per Token (USD)'])
        float(data['Expected Yield /unit'])
    except (ValueError, TypeError):
        return False, "Invalid numeric values"

    # Validate email format
    if '@' not in data['Farm Email']:
        return False, "Invalid email format"

    # Validate wallet address (basic Algorand address check)
    if len(data['Wallet Address']) != 58:
        return False, "Invalid Algorand wallet address format"

    return True, "Valid"

# Error handlers
@app.errorhandler(400)
def bad_request(error):
    return jsonify({'error': 'Bad request', 'message': str(error)}), 400

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found', 'message': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error', 'message': 'An unexpected error occurred'}), 500

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'algorand_available': ALGORAND_AVAILABLE
    })

# Farm data endpoints
@app.route('/api/farms', methods=['GET'])
def get_farms():
    """Get all farms"""
    try:
        farms = load_farm_data()
        return jsonify({
            'success': True,
            'data': farms,
            'count': len(farms)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/farms', methods=['POST'])
def create_farm():
    """Create a new farm"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        # Validate farm data
        is_valid, error_message = validate_farm_data(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_message
            }), 400

        # Add metadata
        data['created_at'] = datetime.utcnow().isoformat()
        data['id'] = len(load_farm_data()) + 1

        # Load existing farms and add new one
        farms = load_farm_data()
        farms.append(data)

        # Save to file
        if save_farm_data(farms):
            return jsonify({
                'success': True,
                'data': data,
                'message': 'Farm created successfully'
            }), 201
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to save farm data'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/farms/<int:farm_id>', methods=['GET'])
def get_farm(farm_id: int):
    """Get a specific farm by ID"""
    try:
        farms = load_farm_data()
        farm = next((f for f in farms if f.get('id') == farm_id), None)

        if not farm:
            return jsonify({
                'success': False,
                'error': 'Farm not found'
            }), 404

        return jsonify({
            'success': True,
            'data': farm
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/farms/<int:farm_id>', methods=['PUT'])
def update_farm(farm_id: int):
    """Update a specific farm"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'error': 'No data provided'
            }), 400

        farms = load_farm_data()
        farm_index = next((i for i, f in enumerate(farms) if f.get('id') == farm_id), None)

        if farm_index is None:
            return jsonify({
                'success': False,
                'error': 'Farm not found'
            }), 404

        # Validate farm data
        is_valid, error_message = validate_farm_data(data)
        if not is_valid:
            return jsonify({
                'success': False,
                'error': error_message
            }), 400

        # Update farm data
        data['updated_at'] = datetime.utcnow().isoformat()
        data['id'] = farm_id
        farms[farm_index] = data

        # Save to file
        if save_farm_data(farms):
            return jsonify({
                'success': True,
                'data': data,
                'message': 'Farm updated successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to save farm data'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/farms/<int:farm_id>', methods=['DELETE'])
def delete_farm(farm_id: int):
    """Delete a specific farm"""
    try:
        farms = load_farm_data()
        farm_index = next((i for i, f in enumerate(farms) if f.get('id') == farm_id), None)

        if farm_index is None:
            return jsonify({
                'success': False,
                'error': 'Farm not found'
            }), 404

        # Remove farm
        deleted_farm = farms.pop(farm_index)

        # Save to file
        if save_farm_data(farms):
            return jsonify({
                'success': True,
                'data': deleted_farm,
                'message': 'Farm deleted successfully'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to save farm data'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Tokenization endpoints
@app.route('/api/farms/<int:farm_id>/tokenize', methods=['POST'])
def tokenize_farm(farm_id: int):
    """Tokenize a farm using smart contracts"""
    try:
        if not ALGORAND_AVAILABLE or not algorand_client:
            return jsonify({
                'success': False,
                'error': 'Algorand services not available'
            }), 503

        # Get farm data
        farms = load_farm_data()
        farm = next((f for f in farms if f.get('id') == farm_id), None)

        if not farm:
            return jsonify({
                'success': False,
                'error': 'Farm not found'
            }), 404

        # Check if already tokenized
        if farm.get('Asset ID') or farm.get('Contract Address'):
            return jsonify({
                'success': False,
                'error': 'Farm is already tokenized'
            }), 400

        # Get request data
        tokenization_data = request.get_json() or {}
        wallet_address = tokenization_data.get('wallet_address', farm['Wallet Address'])
        private_key_hex = tokenization_data.get('private_key')

        if not private_key_hex:
            return jsonify({
                'success': False,
                'error': 'Private key is required for tokenization'
            }), 400

        try:
            # Convert hex private key to bytes
            private_key = bytes.fromhex(private_key_hex)
        except ValueError:
            return jsonify({
                'success': False,
                'error': 'Invalid private key format'
            }), 400

        # Create and deploy the smart contract
        try:
            # Create factory for deploying contracts
            factory = TokenizeFarmFactory(
                algorand=algorand_client,
                app_name=f"FarmToken_{farm_id}"
            )

            # Deploy the contract
            client, deploy_result = factory.deploy(
                create_params=factory.params.create.initialize_farm(
                    args=(farm['Farm Name'], 0),  # asset_id will be set after asset creation
                    params=factory.params.create.bare()
                )
            )

            # Initialize the contract with farm data
            # Note: In a real implementation, you would first create the asset,
            # then initialize the contract with the asset ID

            # Update farm with tokenization data
            farm['Asset ID'] = 0  # Placeholder - would be actual asset ID
            farm['Contract Address'] = client.app_address
            farm['Transaction ID'] = deploy_result.tx_id
            farm['tokenized_at'] = datetime.utcnow().isoformat()

            # Save updated farm data
            farm_index = next((i for i, f in enumerate(farms) if f.get('id') == farm_id), None)
            if farm_index is not None:
                farms[farm_index] = farm
                save_farm_data(farms)

            return jsonify({
                'success': True,
                'data': {
                    'farm_id': farm_id,
                    'contract_address': client.app_address,
                    'transaction_id': deploy_result.tx_id,
                    'asset_id': 0,  # Placeholder
                    'tokenized_at': farm['tokenized_at']
                },
                'message': 'Farm tokenized successfully'
            })

        except Exception as e:
            print(f"Tokenization error: {e}")
            traceback.print_exc()
            return jsonify({
                'success': False,
                'error': f'Tokenization failed: {str(e)}'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/farms/<int:farm_id>/contract', methods=['GET'])
def get_farm_contract(farm_id: int):
    """Get farm contract information"""
    try:
        if not ALGORAND_AVAILABLE or not algorand_client:
            return jsonify({
                'success': False,
                'error': 'Algorand services not available'
            }), 503

        # Get farm data
        farms = load_farm_data()
        farm = next((f for f in farms if f.get('id') == farm_id), None)

        if not farm:
            return jsonify({
                'success': False,
                'error': 'Farm not found'
            }), 404

        contract_address = farm.get('Contract Address')
        if not contract_address:
            return jsonify({
                'success': False,
                'error': 'Farm is not tokenized'
            }), 400

        try:
            # Get contract information
            client = TokenizeFarmClient(
                algorand=algorand_client,
                app_id=0,  # Would need actual app ID
                app_name=f"FarmToken_{farm_id}"
            )

            # Get contract state
            state = client.state.global_state.get_all()

            return jsonify({
                'success': True,
                'data': {
                    'contract_address': contract_address,
                    'farm_id': farm_id,
                    'state': state,
                    'asset_id': farm.get('Asset ID'),
                    'transaction_id': farm.get('Transaction ID')
                }
            })

        except Exception as e:
            return jsonify({
                'success': False,
                'error': f'Failed to get contract info: {str(e)}'
            }), 500

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Algorand utility endpoints
@app.route('/api/algorand/account/<address>', methods=['GET'])
def get_account_info(address: str):
    """Get Algorand account information"""
    try:
        if not ALGORAND_AVAILABLE or not algorand_client:
            return jsonify({
                'success': False,
                'error': 'Algorand services not available'
            }), 503

        # Get account information
        account_info = algorand_client.algod.account_info(address)

        return jsonify({
            'success': True,
            'data': account_info
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/algorand/asset/<int:asset_id>', methods=['GET'])
def get_asset_info(asset_id: int):
    """Get Algorand asset information"""
    try:
        if not ALGORAND_AVAILABLE or not algorand_client:
            return jsonify({
                'success': False,
                'error': 'Algorand services not available'
            }), 503

        # Get asset information
        asset_info = algorand_client.algod.asset_info(asset_id)

        return jsonify({
            'success': True,
            'data': asset_info
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/api/algorand/validate-address', methods=['POST'])
def validate_address():
    """Validate Algorand address"""
    try:
        data = request.get_json()
        if not data or 'address' not in data:
            return jsonify({
                'success': False,
                'error': 'Address is required'
            }), 400

        address = data['address']

        # Basic validation
        is_valid = len(address) == 58 and address.isalnum()

        return jsonify({
            'success': True,
            'data': {
                'address': address,
                'is_valid': is_valid
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

# Statistics endpoint
@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get platform statistics"""
    try:
        farms = load_farm_data()

        total_farms = len(farms)
        tokenized_farms = len([f for f in farms if f.get('Asset ID')])
        total_tokens = sum(f.get('Number of Tokens', 0) for f in farms)
        total_value = sum(f.get('Number of Tokens', 0) * f.get('Price per Token (USD)', 0) for f in farms)

        return jsonify({
            'success': True,
            'data': {
                'total_farms': total_farms,
                'tokenized_farms': tokenized_farms,
                'pending_farms': total_farms - tokenized_farms,
                'total_tokens': total_tokens,
                'total_value_usd': total_value,
                'algorand_available': ALGORAND_AVAILABLE
            }
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting AgriToken Flask API...")
    print(f"Algorand services available: {ALGORAND_AVAILABLE}")
    print(f"Farm data file: {FARM_DATA_FILE}")

    app.run(debug=True, host='0.0.0.0', port=5000)
