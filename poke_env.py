# %load pokemon_shadow_env/poke_env.py
import gym
import gym.spaces
from gym.utils import seeding
import enum
import numpy as np
import json
import requests
import os
import uuid

class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
                            np.int16, np.int32, np.int64, np.uint8,
                            np.uint16, np.uint32, np.uint64)):

            return int(obj)
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        else:
            return super(NpEncoder, self).default(obj)

SERVER_URL = os.environ.get('SERVER_URL', 'http://localhost:9874/api/')
#SERVER_URL = os.environ.get('SERVER_URL', 'http://localhost:8000/api/')
#SERVER_URL = os.environ.get('SERVER_URL', 'https://www.genericterraformtesterurl2.com/api/')
#SERVER_URL = os.environ.get('SERVER_URL', 'http://showdownv1-default-ALB-493749793.us-east-1.elb.amazonaws.com:8000/api/')
#MODEL_SERVER_URL = os.environ.get('MODEL_SERVER_URL', 'http://localhost:5767/api/')
MODEL_SERVER_URL = os.environ.get('MODEL_SERVER_URL', 'http://localhost:8000/api/')
#MODEL_SERVER_URL = os.environ.get('MODEL_SERVER_URL', 'https://www.genericterraformtesterurl2.com/api/')

DEFAULT_REWARD_CONFIG_OLD = {
    'taking_too_long_penalty_100_turns':500,
    'win_reward': 100,
    'quick_match_under_30_turns': 20,
    'attack_reward':   25,
    'switch_penalty':  35,
    'pokemon_damaged':  23,
    'yawn_success':  5,
    'attack_resisted':  20,
    'attack_supereffective':  25,
    'attack_immune':  40,
    'confused_begin':  20,
    'confused_end':  10,
    'taunt_begin':  10,
    'taunt_end':  5,
    'item_knockedoffed':  15,
    'attack_missed':  20,
    'stat_debuffed':  20,
    'damage_by_hazards_opponent_ability_or_items':  5,
    'damage_by_own_item':  2,
    'hazards_removed':  10,
    'reflect_tailwind_etc_end':  3,
    'hazards_and_safeguard_etc_start':  10,
    'destiny_bond_start':  2,
    'pokemon_heal':  2,
    'pain_split':  2,
    'status_start':  15,
    'curestatus':  10,
    'critical':  35,
    'fainted':  135,
    'illusion_broken':  15,
    'minor_switch':  5,
    'health_change_base':  0,
}


DEFAULT_REWARD_CONFIG = {
    'taking_too_long_penalty_100_turns':500,
    'win_reward': 200,
    'quick_match_under_30_turns': 20,
    'attack_reward':   10,
    'switch_penalty':  20,
    'pokemon_damaged':  5,
    'yawn_success':  5,
    'attack_resisted':  15,
    'attack_supereffective': 20,
    'attack_immune':  20,
    'confused_begin':  20,
    'confused_end':  10,
    'taunt_begin':  10,
    'taunt_end':  5,
    'item_knockedoffed':  15,
    'attack_missed':  25,
    'stat_debuffed':  20,
    'damage_by_hazards_opponent_ability_or_items':  10,
    'damage_by_own_item':  2,
    'hazards_removed':  10,
    'reflect_tailwind_etc_end':  5,
    'hazards_and_safeguard_etc_start':  10,
    'destiny_bond_start':  2,
    'pokemon_heal':  5,
    'pain_split':  12,
    'status_start':  10,
    'curestatus':  10,
    'critical':  15,
    'fainted':  150,
    'illusion_broken':  15,
    'minor_switch':  5,
    'health_change_base':  5,
}

DEFAULT_REWARD_CONFIG = {
    "attack_immune": 40,
    "attack_missed": 25,
    "attack_resisted": 30,
    "attack_reward": 20,
    "attack_supereffective": 40,
    "confused_begin": 20,
    "confused_end": 10,
    "critical": 35,
    "curestatus": 10,
    "damage_by_hazards_opponent_ability_or_items": 10,
    "damage_by_own_item": 2,
    "destiny_bond_start": 2,
    "fainted": 150,
    "hazards_and_safeguard_etc_start": 20,
    "hazards_removed": 10,
    "health_change_base": 5,
    "illusion_broken": 15,
    "item_knockedoffed": 15,
    "minor_switch": 5,
    "pain_split": 12,
    "pokemon_damaged": 10,
    "pokemon_heal": 5,
    "quick_match_under_30_turns": 60,
    "reflect_tailwind_etc_end": 10,
    "stat_debuffed": 20,
    "status_start": 15,
    "switch_penalty": 33,
    "taking_too_long_penalty_100_turns": 500,
    "taunt_begin": 10,
    "taunt_end": 5,
    "win_reward": 200,
    "yawn_success": 5
}

REWARD_CONFIG = DEFAULT_REWARD_CONFIG
REWARD_CONFIG_STR = os.environ.get('REWARD_CONFIG', json.dumps(DEFAULT_REWARD_CONFIG))

if len(REWARD_CONFIG_STR.strip()) > 0:
    REWARD_CONFIG = json.loads(REWARD_CONFIG_STR)

# No change
NORMAL_RANDOM = 0
# higher weights to attacking moves.
PRIORITY_ATTACK = 1
# Does not leave the battlefield outside a casket (low weights on switches. u-turn ok)
TIL_LAST_BREATH = 2
# weights assigned if curr_pokemon is weak to a STAB move.
# change slots given more weight to pokemon who can resist a STAB attack
STRATEGIC_WITHDRAWAL = 3

REMOTE_AVAILABLE_AI_BOTS = [PRIORITY_ATTACK, PRIORITY_ATTACK]

#Communicates with the environment flask service through
# rest calls

SINGLES = 1
DOUBLES = 2

class PokeSimEnv(gym.Env):
    NETWORK_MODEL = None
    metadata = {'render.modes': ['human']}
    # Store later for other formats but not now
    #Gen Number
    # Game type singles, doubles, triples
    # Battle Format
    # Sleep mod rule. Anything goes, etc.

#    'pikachu': {'thundershock': 1}
#    p1 seen_attacks = {}

    def __init__(self, server_url=SERVER_URL, model_server_url=MODEL_SERVER_URL, user_id="prime_13", session_label="Prime Field Device", group_label="AC2 Model V1", reward_config=REWARD_CONFIG, bot_stategries=REMOTE_AVAILABLE_AI_BOTS):

        self.server_url = server_url
        self.group_label = group_label
        self.session_label = session_label
        self.model_server_url = model_server_url
        self.user_id = user_id

        url = 'get_environment_details'
        response = self.fire_request(url, {})
        obs_space, action_space = response["observation_space"], response["action_space"]

        self.action_space = gym.spaces.Discrete(n=len(action_space))
        self.observation_space = gym.spaces.Box(low=0, high=255, shape=(len(obs_space),), dtype=np.float32)
        self.reward_config=reward_config
        self.bot_stategries=bot_stategries
        self.bot_id=None
        print('Grabbing Bot Id to use')
        self.get_available_bot()

    def get_params(self):
        return {
            'group_label': self.group_label,
            'session_label': self.session_label,
            'user_id': self.user_id,
            'bot_id': self.bot_id
        }

    def fire_request(self, url, params):
        url = self.server_url + url
        data_json = json.dumps(params, cls=NpEncoder)
#        print('url:', url)
        headers = {'content-type': 'application/json'}

        response = requests.post(url, data=data_json, headers=headers, timeout=15)
        return response.json()

    # Checks for least recently used bot to avoid clashes
    def get_available_bot(self):
        params = self.get_params()
        url = 'get_next_bot_id'
        raw_resp = self.fire_request(url, params)
        self.bot_id = raw_resp['bot_id']

    # Checks for least recently used bot to avoid clashes
    def get_most_recent_session(self):
        params = self.get_params()
        url = 'get_last_user_session'
        raw_resp = self.fire_request(url, params)

        return raw_resp['download_url']

    def step(self, action, target, player):
        params = self.get_params()
        params['action'] = action
        params['target'] = target
        params['player'] = player
        url = 'step'
        raw_resp = self.fire_request(url, params)
        obs, reward, done, info = raw_resp['obs'], raw_resp['reward'], raw_resp['done'], raw_resp['info']

        return np.asarray(obs), reward, done, info

    def reset(self, game_type=SINGLES, random_opponent=True, bot_style=None):
        params = self.get_params()
        params['config'] = self.reward_config
        if bot_style is None:
            idx = np.random.choice(len(REMOTE_AVAILABLE_AI_BOTS))
            bot_style = REMOTE_AVAILABLE_AI_BOTS[idx]

        params['bot_style'] = bot_style
        params['game_type'] = SINGLES
        params['random_opponent'] = random_opponent
        url = 'reset'
        raw_resp = self.fire_request(url, params)
        obs, reward, done, info = raw_resp['obs'], raw_resp['reward'], raw_resp['done'], raw_resp['info']

        return np.asarray(obs), reward, done, info

    def sample_actions(self, player='p1'):
        params = self.get_params()
        params['player'] = player
        url = 'get_sample_action'
        resp = self.fire_request(url, params)
        return resp['action'], resp['target']


    def model_fire_request(self, url, params):
        url = self.model_server_url + url
        data_json = json.dumps(params, cls=NpEncoder)
        print('url:', url)
        headers = {'content-type': 'application/json'}

        response = requests.post(url, data=data_json, headers=headers)
        return response.json()

    def model_get_action(self, obs, valid_moves, transcript):
        params = self.get_params()
        params['valid_moves'] = valid_moves
        params['obs'] = obs
        params['transcript'] = transcript
        url = 'predict_valid'
        return self.model_fire_request(url, params)['action']


    def reward(self, reward):
        return reward * 0.01
