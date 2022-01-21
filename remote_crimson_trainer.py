import logging
import numpy as np
import tensorflow as tf
import tensorflow.keras.layers as kl
import tensorflow.keras.losses as kls
import tensorflow.keras.optimizers as ko

print("TensorFlow Ver: ", tf.__version__)

from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.layers import Lambda
from tensorflow.keras.layers import Embedding
from tensorflow.keras.layers import LSTM
from tensorflow.keras.preprocessing.text import Tokenizer
import tensorflow.keras.preprocessing.sequence as sequence
from tensorflow.keras.layers import Dense, Dropout, Flatten, Reshape, Concatenate
from tensorflow.keras.layers import Conv1D, GlobalAveragePooling1D, MaxPooling1D
from tensorflow.keras import backend as K

from crimson_singles_model import *
from crimson_ac2_improved import *
#from ac2 import *

from poke_env import PokeSimEnv as RemotePokeEnv


import os
from zipfile import ZipFile

# Just disables the warning, doesn't enable AVX/FMA
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

print("Version: ", tf.__version__)
print("Eager mode: ", tf.executing_eagerly())
print("GPU is", "available" if tf.config.experimental.list_physical_devices("GPU") else "NOT AVAILABLE")
import time
start = time.time()
import datetime
print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))

MODEL_DIR = os.environ.get('MODEL_DIR', "results")
MODEL_DIR = MODEL_DIR + "/"
if not os.path.exists(os.path.dirname(MODEL_DIR)):
    os.makedirs(os.path.dirname(MODEL_DIR))
MODEL_DIR = os.environ.get('MODEL_DIR', "results")

use_network=False

# set to logging.WARNING to disable logs or logging.DEBUG to see losses as well
logging.getLogger().setLevel(logging.INFO)

# Verify everything works by sampling a single action.
config = {}
env = RemotePokeEnv()
SAMPLE_OBS, _, _, info = env.reset()
#model = Model(num_actions=env.action_space.n)
model = Model(num_actions=env.action_space.n)
#model(env.reset(config)[0][None, :])
model(SAMPLE_OBS[None, :])

print('SAMPLE_OBS', str(SAMPLE_OBS.tolist()))

# used for file names
training_session_id = '%s' % str(uuid.uuid4())

learning_rate = float(os.environ.get('LEARNING_RATE', "7e-6"))
gamma = float(os.environ.get('GAMMA', "0.999"))
value_c = float(os.environ.get('VALUE_C', "0.6"))
entropy_c = float(os.environ.get('ENTROPY_C', "1e-7"))
updates = int(os.environ.get('UPDATES', "3"))
batch_sz = int(os.environ.get('BATCH_SZ', "64"))

#model = Model(num_actions=env.action_space.n)
#agent = A2CAgent(model,lr=7e-3, gamma=0.99, value_c=0.7, entropy_c=1e-3)
#agent = A2CAgent(model,lr=7e-6, gamma=0.999, value_c=0.6, entropy_c=1e-7)

agent = A2CAgent(model,lr=learning_rate, gamma=gamma, value_c=value_c, entropy_c=entropy_c)

rewards_history, winner_history = agent.train(env, batch_sz=batch_sz, updates=updates, use_network=use_network)
print("rewards_history...", rewards_history[-10:])

reward_history_filename = '%s/training_session_reward_history_%s.json' % (MODEL_DIR, training_session_id)
with open(reward_history_filename,'w') as outfile_metrics:
    json.dump(rewards_history, outfile_metrics, sort_keys=True, indent=4)

winner_history_filename = '%s/training_session_winner_history_%s.json' % (MODEL_DIR, training_session_id)
with open(winner_history_filename,'w') as outfile_metrics:
    json.dump(winner_history, outfile_metrics, sort_keys=True, indent=4)

print("Finished training! Testing...")
agent_test_score = agent.test(env)
print("Total Episode Reward: %0.3f out of 200" % agent_test_score)

reward_config_filename = '%s/training_session_reward_config_%s.json' % (MODEL_DIR, training_session_id)
with open(reward_config_filename,'w') as outfile_metrics:
    json.dump(env.reward_config, outfile_metrics, sort_keys=True, indent=4)

agent_hyper_params = {
    "lr": agent.lr,
    "gamma": agent.gamma,
    "value_c": agent.value_c,
    "entropy_c": agent.entropy_c,
    "batch_sz": batch_sz,
    "updates": updates,
}
hyper_params_filename = '%s/training_hyper_params_%s.json' % (MODEL_DIR, training_session_id)
with open(hyper_params_filename,'w') as outfile_metrics:
    json.dump(agent_hyper_params, outfile_metrics, sort_keys=True, indent=4)


weights_filename = '%s/showdown_a2c_weights_%s.h5' % (MODEL_DIR, training_session_id)
model.save_weights('%s' % (weights_filename))

model_test = Model(num_actions=env.action_space.n)

prediction = model_test(SAMPLE_OBS[None, :])
print('prediction', prediction)

model_test.load_weights('%s' % (weights_filename))

# Not sure if loading these make a difference
#test_agent = A2CAgent(model_test, lr=agent.lr, gamma=agent.gamma, value_c=agent.value_c, entropy_c=agent.entropy_c)
test_agent = A2CAgent(model_test)

print("Finished training! Testing...")
loaded_saved_model_score = test_agent.test(env)
print("Total Episode Reward: %.3f out of 200" % loaded_saved_model_score)

model_junk = Model(num_actions=env.action_space.n)
junk_agent = A2CAgent(model_junk)
print("Finished junk training! Testing...")
junk_agent_score = junk_agent.test(env)
print("Total Episode Reward: %.3f out of 200" % junk_agent_score)


print('trained_model_score: %.3f, loaded_model_score: %.3f, junk_untrained_model_score: %.3f ' % (agent_test_score, loaded_saved_model_score, junk_agent_score))
print('weights filename:', weights_filename)
elapsed = time.time() - start
print(datetime.datetime.now().strftime("%Y-%m-%d %H:%M"))
print('start time: %d, elapsed time: %d time time: %d' % (start, elapsed, time.time()))

zipfile_name = '%s_%s_num_updates_%s.zip' % (datetime.datetime.now().strftime("%Y-%m-%d %H:%M"), training_session_id[-8:], updates)

# Create a ZipFile Object
with ZipFile('%s/%s' % (MODEL_DIR, zipfile_name), 'w') as zipObj:
    # Add multiple files to the zip
    zipObj.write(weights_filename)
    zipObj.write(reward_history_filename)
    zipObj.write(winner_history_filename)
    zipObj.write(reward_config_filename)
    zipObj.write(hyper_params_filename)

print('%s file created' % zipfile_name)
