import gym
import logging
import numpy as np
import tensorflow as tf
import tensorflow.keras.layers as kl
import tensorflow.keras.losses as kls
import tensorflow.keras.optimizers as ko
import requests

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

from poke_server_env import *

# No change
NORMAL_RANDOM = 0
# higher weights to attacking moves.
PRIORITY_ATTACK = 1
# Does not leave the battlefield outside a casket (low weights on switches. u-turn ok)
TIL_LAST_BREATH = 2
# weights assigned if curr_pokemon is weak to a STAB move.
# change slots given more weight to pokemon who can resist a STAB attack
STRATEGIC_WITHDRAWAL = 3

AVAILABLE_AI_BOTS = [PRIORITY_ATTACK, PRIORITY_ATTACK]


TARGET_SELF = 0

SELECTABLE_GAMETYPES = [SINGLES, SINGLES, SINGLES]

def get_random_gametype(game_num):
    idx = np.random.choice(len(SELECTABLE_GAMETYPES))
    gametype = SELECTABLE_GAMETYPES[idx]
    return gametype

def get_random_ai_style(game_num):
    idx = np.random.choice(len(SELECTABLE_GAMETYPES))
    ai_style = AVAILABLE_AI_BOTS[idx]
    return ai_style

class A2CAgent:
  def __init__(self, model, lr=7e-3, gamma=0.99, value_c=0.5, entropy_c=1e-4):
    # `gamma` is the discount factor; coefficients are used for the loss terms.
    self.gamma = gamma
    self.value_c = value_c
    self.entropy_c = entropy_c
    self.lr = lr

    self.model = model
    self.model.compile(
      optimizer=ko.RMSprop(lr=lr),
      # Define separate losses for policy logits and value estimate.
      loss=[self._logits_loss, self._value_loss])

  def train(self, env, batch_sz=64, updates=250, use_network=False):
    # Storage helpers for a single batch of data.
    actions = np.empty((batch_sz,), dtype=np.int32)
    rewards, dones, values = np.empty((3, batch_sz))
    observations = np.empty((batch_sz,) + env.observation_space.shape)
    # Training loop: collect samples, send to optimizer, repeat updates times.
    ep_rewards = [0.0]
    winners = []
    r_gametype = get_random_gametype(0)
    next_obs, _, _, info = env.reset(random_opponent=True, game_type=r_gametype)
    random_opponent = False
    player = info['player']
    player_rewards = {'p1': 0, 'p2': 0}
    for update in range(updates):
      if update < 1000:
        random_opponent = True
      else:
        random_opponent=update % 10 == 0
#      random_opponent=random_opponent and update % 11 != 0
      for step in range(batch_sz):
        observations[step] = next_obs.copy()
        if sum(info['valid_onehot_moves']) == 0.0:
            print("p1 info['valid_onehot_moves']", info['valid_onehot_moves'])
        actions[step], values[step] = self.model.action_value(next_obs[None, :], info['valid_onehot_moves'])
        if info['valid_onehot_moves'][actions[step]] == 0:
            print('invalid choice made')
            print('valid_moves', info['valid_onehot_moves'])
            b=1/0


        try:
          next_obs, rewards[step], dones[step], info = env.step(actions[step], TARGET_SELF, player)
          player = info['player']
          player_rewards[player] += rewards[step]
        except requests.Timeout:
          # back off and retry
          print('timeout step request force ending session')
          r_gametype = get_random_gametype(update)
          next_obs, _, _, info = env.reset(random_opponent=random_opponent, game_type=r_gametype)
          player = info['player']
          dones[step] = True
          rewards[step] = 0.0

        ep_rewards[-1] += rewards[step]
        if dones[step]:
          if 'winner' in info:
              winners.append(info['winner'])
          else:
              winners.append('no one')
          ep_rewards.append(0.0)
          r_gametype = get_random_gametype(update)
          next_obs, _, _, info = env.reset(random_opponent=random_opponent, game_type=r_gametype)
          player = info['player']
          logging.info("Episode: %0.1f, Random: %s, Rewards: {%0.3f, %0.3f}, Winner:%s" % (len(ep_rewards) - 1, random_opponent,  player_rewards['p1'], player_rewards['p2'], winners[-1]))
          player_rewards = {'p1': 0, 'p2': 0}

      if sum(info['valid_onehot_moves']) == 0.0:
          print("batches info['valid_onehot_moves']", info['valid_onehot_moves'])
      _, next_value = self.model.action_value(next_obs[None, :], info['valid_onehot_moves'])
      returns, advs = self._returns_advantages(rewards, dones, values, next_value)
      # A trick to input actions and advantages through same API.
      acts_and_advs = np.concatenate([actions[:, None], advs[:, None]], axis=-1)
      # Performs a full training step on the collected batch.
      # Note: no need to mess around with gradients, Keras API handles it.
      print("training on batches: %d of %d" % (update, updates))
      losses = self.model.train_on_batch(observations, [acts_and_advs, returns])
      logging.debug("[%d/%d] Losses: %s" % (update + 1, updates, losses))

    return ep_rewards, winners

  def test(self, env, render=False, use_network=False):
    obs, ep_reward, done, info = env.reset()
    while not done:
        action = None
        if use_network:
#            print(info)
            action = env.model_get_action(obs, info['valid_onehot_moves'], info['transcript'])
        else:
            action, _ = self.model.action_value(obs[None, :], info['valid_onehot_moves'])
        try:
            obs, reward, done, info = env.step(action, TARGET_SELF, 'p1')
        except requests.Timeout:
            # back off and retry
            print('timeout step request force ending session')
            done = True
        ep_reward += reward
        if render:
            env.render()
    return ep_reward

  def _returns_advantages(self, rewards, dones, values, next_value):
    # `next_value` is the bootstrap value estimate of the future state (critic).
    returns = np.append(np.zeros_like(rewards), next_value, axis=-1)
    # Returns are calculated as discounted sum of future rewards.
    for t in reversed(range(rewards.shape[0])):
      returns[t] = rewards[t] + self.gamma * returns[t + 1] * (1 - dones[t])
    returns = returns[:-1]
    # Advantages are equal to returns - baseline (value estimates in our case).
    advantages = returns - values
    return returns, advantages

  def _value_loss(self, returns, value):
    # Value loss is typically MSE between value estimates and returns.
    return self.value_c * kls.mean_squared_error(returns, value)

  def _logits_loss(self, actions_and_advantages, logits):
    # A trick to input actions and advantages through the same API.
    actions, advantages = tf.split(actions_and_advantages, 2, axis=-1)
    # Sparse categorical CE loss obj that supports sample_weight arg on `call()`.
    # `from_logits` argument ensures transformation into normalized probabilities.
    weighted_sparse_ce = kls.SparseCategoricalCrossentropy(from_logits=True)
    # Policy loss is defined by policy gradients, weighted by advantages.
    # Note: we only calculate the loss on the actions we've actually taken.
    actions = tf.cast(actions, tf.int32)
    policy_loss = weighted_sparse_ce(actions, logits, sample_weight=advantages)
    # Entropy loss can be calculated as cross-entropy over itself.
    probs = tf.nn.softmax(logits)
    entropy_loss = kls.categorical_crossentropy(probs, probs)
    # We want to minimize policy and maximize entropy losses.
    # Here signs are flipped because the optimizer minimizes.
    return policy_loss - self.entropy_c * entropy_loss
