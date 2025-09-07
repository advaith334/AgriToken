from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
import algokit_utils
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Create data directory if it doesn't exist
DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data', 'farm_info')
os.makedirs(DATA_DIR, exist_ok=True)

class FarmTokenization:
    def __init__(self):
        self.algorand_client = algokit_utils.AlgorandClient.from_environment()
        self.deployer = self.algorand_client.account.from_environment("DEPLOYER")

    def tokenize_farm(self, farm_name, token_number, unit_name, wallet_address):
        """Create a farm asset on Algorand blockchain"""
        try:
            # Create asset using algokit_utils with deployer as sender
            asset_result = self.algorand_client.send.asset_create(
                algokit_utils.AssetCreateParams(
                    sender=self.deployer.address,
                    total=token_number,
                    decimals=0,
                    default_frozen=False,
                    manager=wallet_address,
                    reserve=wallet_address,
                    freeze=wallet_address,
                    clawback=wallet_address,
                    unit_name=unit_name,
                    asset_name=farm_name,
                )
            )
            return {
                'success': True,
                'asset_id': asset_result.asset_id,
                'transaction_id': asset_result.tx_id
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

def save_farm_data_to_json(farm_data):
    """Save farm data to JSON file"""
    try:
        # Add timestamp
        farm_data['created_at'] = datetime.now().isoformat()

        # Create filename based on farm name and timestamp
        farm_name_safe = "".join(c for c in farm_data.get('Farm Name', 'unknown') if c.isalnum() or c in (' ', '-', '_')).rstrip()
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"{farm_name_safe}_{timestamp}.json"
        filepath = os.path.join(DATA_DIR, filename)

        # Save to JSON file
        with open(filepath, 'w') as f:
            json.dump(farm_data, f, indent=2)

        return True, filepath
    except Exception as e:
        return False, str(e)

@app.route('/tokenize_farm', methods=['POST'])
def tokenize_farm():
    try:
        json_data = request.get_json()

        # Validate required fields
        required_fields = ["Farm Name", "Number of Tokens", "Token Unit", "Wallet Address"]
        for field in required_fields:
            if field not in json_data or not json_data[field]:
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400

        # Validate unit name length (Algorand limit is 8 characters)
        if len(json_data["Token Unit"]) > 8:
            return jsonify({
                'success': False,
                'error': f'Token Unit must be 8 characters or less. Current length: {len(json_data["Token Unit"])}'
            }), 400

        farm_name = json_data["Farm Name"]
        token_number = json_data["Number of Tokens"]
        unit_name = json_data["Token Unit"]
        wallet_address = json_data["Wallet Address"]

        # Create farm tokenization instance
        farm_tokenization = FarmTokenization()

        # Tokenize the farm on blockchain
        tokenization_result = farm_tokenization.tokenize_farm(farm_name, token_number, unit_name, wallet_address)

        if not tokenization_result['success']:
            return jsonify({
                'success': False,
                'error': f'Tokenization failed: {tokenization_result["error"]}'
            }), 500

        # Add blockchain information to farm data
        farm_data_with_blockchain = {
            **json_data,
            'Asset ID': tokenization_result['asset_id'],
            'Transaction ID': tokenization_result['transaction_id'],
            'Blockchain': 'Algorand Testnet',
            'Contract Address': '745495312'
        }

        # Save farm data to JSON file
        save_success, save_result = save_farm_data_to_json(farm_data_with_blockchain)

        if not save_success:
            return jsonify({
                'success': False,
                'error': f'Failed to save farm data: {save_result}'
            }), 500

        return jsonify({
            'success': True,
            'message': 'Farm successfully tokenized!',
            'asset_id': tokenization_result['asset_id'],
            'transaction_id': tokenization_result['transaction_id'],
            'data_file': save_result
        })

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Server error: {str(e)}'
        }), 500

@app.route('/farms', methods=['GET'])
def get_farms():
    """Get all farm data from JSON files"""
    try:
        farms = []

        # Check if data directory exists
        if not os.path.exists(DATA_DIR):
            return jsonify([])

        # Read all JSON files in the farm_info directory
        for filename in os.listdir(DATA_DIR):
            if filename.endswith('.json'):
                filepath = os.path.join(DATA_DIR, filename)
                try:
                    with open(filepath, 'r') as f:
                        farm_data = json.load(f)

                        # Handle different data structures
                        if isinstance(farm_data, dict):
                            # If the file contains a "farms" array, extract those farms
                            if "farms" in farm_data and isinstance(farm_data["farms"], list):
                                farms.extend(farm_data["farms"])
                            # If it's a single farm object, add it directly
                            elif "Farm Name" in farm_data:
                                farms.append(farm_data)
                        # If it's already a list, extend the farms list
                        elif isinstance(farm_data, list):
                            farms.extend(farm_data)

                except (json.JSONDecodeError, IOError) as e:
                    print(f"Error reading {filename}: {e}")
                    continue

        return jsonify(farms)

    except Exception as e:
        return jsonify({
            'error': f'Failed to load farm data: {str(e)}'
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy', 'message': 'Farm Tokenization API is running'})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
