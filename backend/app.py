from flask import Flask, request, jsonify
from flask_cors import CORS
import ner

app = Flask(__name__)
CORS(app)

@app.route('/backend', methods=['POST'])
def your_endpoint():
    data = request.json  # Get data from the request

    # Process data or perform any necessary actions here
    text = data['text']
    lines = text.split("\n")
    dict = {}
    dict['geo'] = []
    dict['org'] = []
    dict['per'] = []
    dict['gpe'] = []
    dict['tim'] = []
    for line in lines:
        d = ner.ner_analyze(line)
        for key, item in d.items():
            dict[key].extend(item)
    for key in dict:
        dict[key] = list(set(dict[key]))
        dict[key] = [string for string in dict[key] if len(string)>=3]
    response_data = {"message": "Data received successfully","data":dict}
    return jsonify(response_data)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)
