from flask import Flask, request, jsonify, send_file
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

@app.route('/tokenize_farm', methods=['POST'])
def tokenize_farm():
    json_data = request.get_json()
    farm_name = json_data["Farm Name"]
    token_number = json_data["Number of Tokens"]
    unit_name = json_data["Token Unit"]
    wallet_address = json_data["Wallet Address"]

    farm_tokenization = FarmTokenization()
    farm_tokenization.tokenize_farm(farm_name, token_number, unit_name, wallet_address)
