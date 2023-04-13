import flask
from flask import Flask, request, Response
from flask import request
from flask_cors import CORS, cross_origin
from dueling_deep_q_network_uriah import PokeDuelingDeepQNetworkUriah
import numpy as np
import torch as T
import os
from pyngrok import ngrok
import json

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.debug = True


DEBUG = bool(int(os.environ.get('DEBUG', 1)))

FLASK_PORT = int(os.environ.get('FLASK_PORT', 9797))

#### Get your own Auth Token.
#https://dashboard.ngrok.com/signup
ngrok.set_auth_token("2OLlCYiya0rRpyNnhibEV9qZtX8_6H3qENJFfQTTFPsWBT8MG")
public_url =  ngrok.connect(FLASK_PORT).public_url
print(f"To acces the Gloable link please click {public_url}")


lr = 0.001
input_dims = (641,)
n_actions = 14
chkpt_dir = "models/"
model = PokeDuelingDeepQNetworkUriah(lr, n_actions, input_dims=input_dims,
    name="PokeEnv-v1_PokeDuelingDDQNRandomAgent_0.0001_0.99_config_ver_2_q_next", chkpt_dir=chkpt_dir)
model.load_checkpoint()

@app.after_request
def add_header(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
            np.int16, np.int32, np.int64, np.uint8,
            np.uint16, np.uint32, np.uint64)):
            return int(obj)
        elif isinstance(obj, (np.float_, np.float16, np.float32,
            np.float64)):
            return float(obj)
        elif isinstance(obj,(np.ndarray,)): #### This is the fix
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def jsonify(obj, status=200, headers=None):
    """ Custom JSONificaton to support obj.to_dict protocol. """
    data = NumpyEncoder().encode(obj)
    if 'callback' in request.args:
        cb = request.args.get('callback')
        data = '%s && %s(%s)' % (cb, cb, data)
    return Response(data, headers=headers, status=status,
            mimetype='application/json')



@app.route('/api/predict', methods=['POST', "OPTIONS"])
@cross_origin(origin='*',headers=['access-control-allow-origin','Content-Type'])
@cross_origin()
def predict():
    payload = {}
    print('dwdwwd')
    print('request', request)
    print (request.__dict__)
    if request.method == "OPTIONS": # CORS preflight
        print('sending preflight')
        return _build_cors_preflight_response()

    print('captain kiddo')
    data = request.get_json(force=True)
    print('data', data)
    print('keys', data.keys())
    observation = np.asarray(data['obs'])
    valid_moves = observation[-n_actions:]
    #print('valid_moves', valid_moves)
    state = np.array([observation], copy=False, dtype=np.float32)
    state_tensor = T.tensor(state).to(model.device)
    _, advantages = model.forward(state_tensor)

    action = T.argmax(advantages).item()
    #action, value = model.action_value(obs[None, :])

    resp = {
        'action':int(action),
        'target': 0,
    }
    print(resp)

    return jsonify(resp)

if __name__ == '__main__':
    try:
      app.run(debug=False,host='0.0.0.0', port=FLASK_PORT)
    except:
      app.run(port=FLASK_PORT)

def _build_cors_preflight_response():
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response

def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

def jsonify2(obj, status=200, headers=None):
    """ Custom JSONificaton to support obj.to_dict protocol. """
    data = NpEncoder().encode(obj)
    if 'callback' in request.args:
        cb = request.args.get('callback')
        data = '%s && %s(%s)' % (cb, cb, data)
    return Response(data, headers=headers, status=status,
            mimetype='application/json')
