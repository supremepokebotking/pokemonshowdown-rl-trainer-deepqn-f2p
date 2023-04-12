import flask
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
from dueling_deep_q_network_uriah import PokeDuelingDeepQNetworkUriah
import numpy as np
import torch as T

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


import numpy as np
import json
from dqn_agent import PokeDDQNAgentUriah
import os

DEBUG = bool(int(os.environ.get('DEBUG', 1)))

FLASK_PORT = int(os.environ.get('FLASK_PORT', 9797))

lr = 0.001
input_dims = (641,)
n_actions = 14
chkpt_dir = "models/"
model = PokeDuelingDeepQNetworkUriah(lr, n_actions, input_dims=input_dims,
    name="PokeEnv-v1_PokeDuelingDDQNRandomAgent_0.001_1.4_config_ver_2_q_next", chkpt_dir=chkpt_dir)
model.load_checkpoint()

@app.route('/api/predict',methods=['POST'])
@cross_origin()
def predict():
    payload = {}

    data = request.get_json()
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

    return json.dumps(resp)

if __name__ == '__main__':
    app.run(debug=True,host='0.0.0.0', port=FLASK_PORT, threaded=DEBUG)


def jsonify(obj, status=200, headers=None):
    """ Custom JSONificaton to support obj.to_dict protocol. """
    data = NpEncoder().encode(obj)
    if 'callback' in request.args:
        cb = request.args.get('callback')
        data = '%s && %s(%s)' % (cb, cb, data)
    return Response(data, headers=headers, status=status,
            mimetype='application/json')
