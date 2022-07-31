import gym
import gym.spaces
from gym.utils import seeding
import enum
import numpy as np

import random
import math
import math
import subprocess
import uuid
import pandas as pd
import time;
import collections
import os
import json
import copy
import re

DISPLAY_EVERYTHING = bool(int(os.environ.get('DISPLAY_EVERYTHING', 1)))
ALWAYS_SHOW_SUMMARY = bool(int(os.environ.get('ALWAYS_SHOW_SUMMARY', 0)))
CHOOSE_RANDOM_MOVE_FOR_INVALID_ACTION = bool(int(os.environ.get('CHOOSE_RANDOM_MOVE_FOR_INVALID_ACTION', 0)))
PRINT_INVALID_CHOICE_MESSAGE = bool(int(os.environ.get('PRINT_INVALID_CHOICE_MESSAGE', 1)))

force_switch_regex = '\|request\|{"forceSwitch":\['
wait_regex = '\|request\|{"wait":true'
observation_regex = '\|observation\|{"'
encoders_regex = '\|encoders\|{"'
update_complete_regex = '\|turn\|\d*'
trapped_regex_1 = '\|error\|\[Unavailable choice\] Can\'t switch: The active Pokémon is trapped'
trapped_regex_2 = '\|error\|\[Invalid choice\] Can\'t switch: The active Pokémon is trapped'


SERVER_URL = os.environ.get('SERVER_URL', 'http://localhost:9874/api/')
#SERVER_URL = os.environ.get('SERVER_URL', 'http://localhost:8000/api/')
#SERVER_URL = os.environ.get('SERVER_URL', 'https://www.genericterraformtesterurl2.com/api/')
#SERVER_URL = os.environ.get('SERVER_URL', 'http://showdownv1-default-ALB-493749793.us-east-1.elb.amazonaws.com:8000/api/')
#MODEL_SERVER_URL = os.environ.get('MODEL_SERVER_URL', 'http://localhost:5767/api/')
MODEL_SERVER_URL = os.environ.get('MODEL_SERVER_URL', 'http://localhost:8000/api/')

SUPPORTED_FORMATS = [
    'gen8uber', 'gen8ou', 'gen8uubl', 'gen8uu', 'gen8rubl', 'gen8ru', 'gen8nubl', 'gen8nu', 'gen8publ', 'gen8pu', 'gen8zu', 'gen8nfe', 'gen8lc', 'gen8cap', 'gen8caplc', 'gen8capnfe', 'gen8ag',
]

SUPPORTED_FORMATS = [
    'gen8uber', 'gen8ou', 'gen8uubl', 'gen8uu', 'gen8rubl', 'gen8ru', 'gen8nubl', 'gen8nu', 'gen8publ', 'gen8pu', 'gen8zu', 'gen8nfe', 'gen8lc'
]

TEAM_PREVIEW_FORMATS = ['gen8ou', 'gen8uu', 'gen8ru', 'gen8nu', 'gen8pu', 'gen8zu', 'gen8nfe', 'gen8lc', 'gen8cap' ]

class GameType(enum.Enum):
    SINGLES = 1
    EXPERIMENTAL_SINGLES = 4

    def name(self):
        if self in [GameType.SINGLES, GameType.EXPERIMENTAL_SINGLES]:
            return 'singles'

class GEN(enum.Enum):
    ONE = 1
    TWO = 2
    THREE = 3
    FOUR = 4
    FIVE = 5
    SIX = 6
    SEVEN = 7
    EIGHT = 8

ALL_GAME_TYPES = [GameType.SINGLES, GameType.EXPERIMENTAL_SINGLES ]

class SELECTABLE_TARGET(enum.Enum):
    DO_NOT_SPECIFY=0  # Used for most options, singles/random/normal/self,multi... and shifts
    SELF=1
    FOE_SLOT_1=2
    ALLY_SLOT_1=3
    FOE_SLOT_2=4
    ALLY_SLOT_2=5
    FOE_SLOT_3=6
    ALLY_SLOT_3=7

    def get_target_index(self, position):
        if self == SELECTABLE_TARGET.DO_NOT_SPECIFY:
            return ''

        if self == SELECTABLE_TARGET.SELF:
            if position == 'a':
                return '-1'
            else:
                return '-2'

        if self == SELECTABLE_TARGET.ALLY_SLOT_1:
            return '-1'

        if self == SELECTABLE_TARGET.ALLY_SLOT_2:
            return '-2'

        if self == SELECTABLE_TARGET.ALLY_SLOT_3:
            return '-3'

        if self == SELECTABLE_TARGET.FOE_SLOT_1:
            return '+1'

        if self == SELECTABLE_TARGET.FOE_SLOT_2:
            return '+2'

        if self == SELECTABLE_TARGET.FOE_SLOT_3:
            return '+3'


class Action(enum.Enum):
  Attack_Slot_1 = 0
  Attack_Slot_2 = 1
  Attack_Slot_3 = 2
  Attack_Slot_4 = 3
  Change_Slot_1 = 4
  Change_Slot_2 = 5
  Change_Slot_3 = 6
  Change_Slot_4 = 7
  Change_Slot_5 = 8
  Change_Slot_6 = 9
  Attack_Mega_Slot_1 = 10
  Attack_Mega_Slot_2 = 11
  Attack_Mega_Slot_3 = 12
  Attack_Mega_Slot_4 = 13
  Attack_ZMove_Slot_1 = 14
  Attack_ZMove_Slot_2 = 15
  Attack_ZMove_Slot_3 = 16
  Attack_ZMove_Slot_4 = 17
  Attack_Ultra_Slot_1 = 18
  Attack_Ultra_Slot_2 = 19
  Attack_Ultra_Slot_3 = 20
  Attack_Ultra_Slot_4 = 21
  Attack_Dyna_Slot_1 = 22
  Attack_Dyna_Slot_2 = 23
  Attack_Dyna_Slot_3 = 24
  Attack_Dyna_Slot_4 = 25
  SHIFT_LEFT = 27
  Not_Decided = 28          # position hasn't been decided yet
  Pass = 29 # For doubles no-op


  def get_base_weight(self):
      return 1

  def get_attack_priority_weight(self):
      if self in ATTACK_ACTIONS:
          return 0.3
      if self in SWITCH_ACTIONS:
          return 0.1
      return 0.05

  def get_till_last_breath_weight(self):
      if self in ATTACK_ACTIONS:
          return 0.3
      if self in SWITCH_ACTIONS:
          return 0.01
      return 0.05

  def get_strategic_withdrawl_weight(self, is_weak_to_stab=False, under_45_percent=False):
      # if nothing special going on. randomly pick between the other styles.
      other_options = [self.get_base_weight(), self.get_till_last_breath_weight(), self.get_attack_priority_weight()]

      if is_weak_to_stab == False or under_45_percent == False:
          return np.random.choice(other_options, 1)[0]


      if self in ATTACK_ACTIONS:
          return 0.1
      if self in SWITCH_ACTIONS:
          return 0.4
      return 0.05

  def get_twitch_commands(self):
      if self == Action.Attack_Slot_1:
          return '!attack1'
      if self == Action.Attack_Slot_2:
          return '!attack2'
      if self == Action.Attack_Slot_3:
          return '!attack3'
      if self == Action.Attack_Slot_4:
          return '!attack4'
      if self == Action.Attack_Dyna_Slot_1:
          return '!dyna1'
      if self == Action.Attack_Dyna_Slot_2:
          return '!dyna2'
      if self == Action.Attack_Dyna_Slot_3:
          return '!dyna3'
      if self == Action.Attack_Dyna_Slot_4:
          return '!dyna4'
      if self == Action.Change_Slot_1:
          return '!switch1'
      if self == Action.Change_Slot_2:
          return '!switch2'
      if self == Action.Change_Slot_3:
          return '!switch3'
      if self == Action.Change_Slot_4:
          return '!switch4'
      if self == Action.Change_Slot_5:
          return '!switch5'
      if self == Action.Change_Slot_6:
          return '!switch6'
#      if self == Action.Attack_Struggle:
#          return '!struggle'

  def get_action_for_twitch_commands(command):
      if command == '!attack1':
          return Action.Attack_Slot_1
      if command == '!attack2':
          return Action.Attack_Slot_2
      if command == '!attack3':
          return Action.Attack_Slot_3
      if command == '!attack4':
          return Action.Attack_Slot_4
      if command == '!dyna1':
          return Action.Attack_Dyna_Slot_1
      if command == '!dyna2':
          return Action.Attack_Dyna_Slot_2
      if command == '!dyna3':
          return Action.Attack_Dyna_Slot_3
      if command == '!dyna4':
          return Action.Attack_Dyna_Slot_4
      if command == '!switch1':
          return Action.Change_Slot_1
      if command == '!switch2':
          return Action.Change_Slot_2
      if command == '!switch3':
          return Action.Change_Slot_3
      if command == '!switch4':
          return Action.Change_Slot_4
      if command == '!switch5':
          return Action.Change_Slot_5
      if command == '!switch6':
          return Action.Change_Slot_6
#      if command == '!struggle':
#          return Action.Attack_Struggle



class RANDOM_STYLES(enum.Enum):
    # No change
    NORMAL_RANDOM = 0
    # higher weights to attacking moves.
    PRIORITY_ATTACK = 1
    # Does not leave the battlefield outside a casket (low weights on switches. u-turn ok)
    TIL_LAST_BREATH = 2
    # weights assigned if curr_pokemon is weak to a STAB move.
    # change slots given more weight to pokemon who can resist a STAB attack
    STRATEGIC_WITHDRAWAL = 3

ATTACK_ACTIONS =  (Action.Attack_Slot_1, Action.Attack_Slot_2, Action.Attack_Slot_3, Action.Attack_Slot_4,
                    Action.Attack_Dyna_Slot_1, Action.Attack_Dyna_Slot_2, Action.Attack_Dyna_Slot_3, Action.Attack_Dyna_Slot_4,
                    Action.Attack_Mega_Slot_1, Action.Attack_Mega_Slot_2, Action.Attack_Mega_Slot_3, Action.Attack_Mega_Slot_4,
                    Action.Attack_ZMove_Slot_1, Action.Attack_ZMove_Slot_2, Action.Attack_ZMove_Slot_3, Action.Attack_ZMove_Slot_4,
                    Action.Attack_Ultra_Slot_1, Action.Attack_Ultra_Slot_2, Action.Attack_Ultra_Slot_3, Action.Attack_Ultra_Slot_4,)

DYNAMAX_ATTACK_ACTIONS = [Action.Attack_Dyna_Slot_1, Action.Attack_Dyna_Slot_2, Action.Attack_Dyna_Slot_3, Action.Attack_Dyna_Slot_4]
MEGA_ATTACK_ACTIONS = [Action.Attack_Mega_Slot_1, Action.Attack_Mega_Slot_2, Action.Attack_Mega_Slot_3, Action.Attack_Mega_Slot_4]
ZMOVE_ATTACK_ACTIONS = [Action.Attack_ZMove_Slot_1, Action.Attack_ZMove_Slot_2, Action.Attack_ZMove_Slot_3, Action.Attack_ZMove_Slot_4]
ULTRA_ATTACK_ACTIONS = [Action.Attack_Ultra_Slot_1, Action.Attack_Ultra_Slot_2, Action.Attack_Ultra_Slot_3, Action.Attack_Ultra_Slot_4]

SWITCH_ACTIONS =  (Action.Change_Slot_1, Action.Change_Slot_2, Action.Change_Slot_3, Action.Change_Slot_4,
                    Action.Change_Slot_5, Action.Change_Slot_6 )

ALL_RANDOM_STYLES = [RANDOM_STYLES.NORMAL_RANDOM, RANDOM_STYLES.PRIORITY_ATTACK, RANDOM_STYLES.TIL_LAST_BREATH, RANDOM_STYLES.STRATEGIC_WITHDRAWAL ]
ALL_RANDOM_WEIGHTS = [0.3, 0.4, 0.2, 0.1 ]

def get_actions_for_gen(gen, gametype):
  if (gen < 6 and gametype != 'triples'):
    return [
      Action.Attack_Slot_1, Action.Attack_Slot_2, Action.Attack_Slot_3, Action.Attack_Slot_4,
      Action.Change_Slot_1, Action.Change_Slot_2, Action.Change_Slot_3, Action.Change_Slot_4, Action.Change_Slot_5, Action.Change_Slot_6,
    ]
  if (gen in [5, 6] and gametype == 'triples'):
    if(gen == 5):
      return [
        Action.Attack_Slot_1, Action.Attack_Slot_2, Action.Attack_Slot_3, Action.Attack_Slot_4,
        Action.Change_Slot_1, Action.Change_Slot_2, Action.Change_Slot_3, Action.Change_Slot_4, Action.Change_Slot_5, Action.Change_Slot_6,
        Action.SHIFT_LEFT,
      ]
    elif(gen == 6):
      return [
        Action.Attack_Slot_1, Action.Attack_Slot_2, Action.Attack_Slot_3, Action.Attack_Slot_4,
        Action.Change_Slot_1, Action.Change_Slot_2, Action.Change_Slot_3, Action.Change_Slot_4, Action.Change_Slot_5, Action.Change_Slot_6,
        Action.Attack_Mega_Slot_1, Action.Attack_Mega_Slot_2, Action.Attack_Mega_Slot_3, Action.Attack_Mega_Slot_4,
        Action.SHIFT_LEFT,
      ]

  if(gen == 6):
    return [
      Action.Attack_Slot_1, Action.Attack_Slot_2, Action.Attack_Slot_3, Action.Attack_Slot_4,
      Action.Change_Slot_1, Action.Change_Slot_2, Action.Change_Slot_3, Action.Change_Slot_4, Action.Change_Slot_5, Action.Change_Slot_6,
      Action.Attack_Mega_Slot_1, Action.Attack_Mega_Slot_2, Action.Attack_Mega_Slot_3, Action.Attack_Mega_Slot_4,
    ]

  if (gen == 7):
    return [
      Action.Attack_Slot_1, Action.Attack_Slot_2, Action.Attack_Slot_3, Action.Attack_Slot_4,
      Action.Change_Slot_1, Action.Change_Slot_2, Action.Change_Slot_3, Action.Change_Slot_4, Action.Change_Slot_5, Action.Change_Slot_6,
      Action.Attack_Mega_Slot_1, Action.Attack_Mega_Slot_2, Action.Attack_Mega_Slot_3, Action.Attack_Mega_Slot_4,
      Action.Attack_ZMove_Slot_1, Action.Attack_ZMove_Slot_2, Action.Attack_ZMove_Slot_3, Action.Attack_ZMove_Slot_4,
      Action.Attack_Ultra_Slot_1, Action.Attack_Ultra_Slot_2, Action.Attack_Ultra_Slot_3, Action.Attack_Ultra_Slot_4,
    ]
  if (gen == 8):
    return [
      Action.Attack_Slot_1, Action.Attack_Slot_2, Action.Attack_Slot_3, Action.Attack_Slot_4,
      Action.Change_Slot_1, Action.Change_Slot_2, Action.Change_Slot_3, Action.Change_Slot_4, Action.Change_Slot_5, Action.Change_Slot_6,
      Action.Attack_Dyna_Slot_1, Action.Attack_Dyna_Slot_2, Action.Attack_Dyna_Slot_3, Action.Attack_Dyna_Slot_4,
    ]
#  // should not reach here
  return [
    Action.Attack_Slot_1, Action.Attack_Slot_2, Action.Attack_Slot_3, Action.Attack_Slot_4,
    Action.Change_Slot_1, Action.Change_Slot_2, Action.Change_Slot_3, Action.Change_Slot_4, Action.Change_Slot_5, Action.Change_Slot_6,
  ]

def get_action_text_for_action_and_target(player, action, target_text, is_doubles):
  action = action
  if action == None:
    actions = len(Action)
    action = random.randint(0,actions-2)
    action = Action(action)
  # lazy avoid shifts
  action_text = 'move 1'
  if action == Action.Attack_Slot_1:
    action_text = 'move 1'
  if action == Action.Attack_Slot_2:
    action_text = 'move 2'
  if action == Action.Attack_Slot_3:
    action_text = 'move 3'
  if action == Action.Attack_Slot_4:
    action_text = 'move 4'
  if action == Action.Attack_Dyna_Slot_1:
    action_text = 'move 1 dynamax'
  if action == Action.Attack_Dyna_Slot_2:
    action_text = 'move 2 dynamax'
  if action == Action.Attack_Dyna_Slot_3:
    action_text = 'move 3 dynamax'
  if action == Action.Attack_Dyna_Slot_4:
    action_text = 'move 4 dynamax'

  if action == Action.Change_Slot_1:
    action_text = 'switch 1'
  if action == Action.Change_Slot_2:
    action_text = 'switch 2'
  if action == Action.Change_Slot_3:
    action_text = 'switch 3'
  if action == Action.Change_Slot_4:
    action_text = 'switch 4'
  if action == Action.Change_Slot_5:
    action_text = 'switch 5'
  if action == Action.Change_Slot_6:
    action_text = 'switch 6'
  if action == Action.Pass:
    action_text = 'pass'


  message = '>%s %s' % (player, action_text)
#  move_history.append(message)
  if not is_doubles:
      return message
  return '%s %s' % (message, target_text)



class ActionRequest():
    def __init__(self):
        self.active_pokemon_actions = {'a':Action.Not_Decided,'b':Action.Not_Decided,'c':Action.Not_Decided}
        self.active_pokemon_targets = {'a':SELECTABLE_TARGET.DO_NOT_SPECIFY,'b':SELECTABLE_TARGET.DO_NOT_SPECIFY,'c':SELECTABLE_TARGET.DO_NOT_SPECIFY}
        #Important enough for one hot encoding?
        self.action_for_position = SELECTABLE_TARGET.ALLY_SLOT_1

    @staticmethod
    def get_raw_verify_labels():
        category_encode_labels = []
        category_encode_labels.append('active_pokemon_actions_a')
        category_encode_labels.append('active_pokemon_targets_a')
        category_encode_labels.append('active_pokemon_actions_b')
        category_encode_labels.append('active_pokemon_targets_b')
        category_encode_labels.append('action_for_position')

        return category_encode_labels

class EnvironState():

    def __init__(self, random_style=RANDOM_STYLES.PRIORITY_ATTACK):
        super().__init__()
        self.random_style = RANDOM_STYLES.PRIORITY_ATTACK
        self.clear_everything()
        self.simulate = None
        self.is_doubles = True
        self.is_triples = False
        self.reward_config = DEFAULT_REWARD_CONFIG
        self.display_everything = DISPLAY_EVERYTHING
        self.rewards = []


    def clear_everything(self):
        self.turns = 0
        self.steps = 0
        self.p1_kifu = []
        self.p2_kifu = []
        self.p1_raw_kifu = []
        self.p2_raw_kifu = []
        self.p1_raw_labels = []
        self.p2_raw_labels = []
        self.p1_raw_observations = []
        self.p2_raw_observations = []
        self.p1_observations = []
        self.p2_observations = []
        self.p1_valid_moves = {'a': [], 'b': [], 'c': []}
        self.p2_valid_moves = {'a': [], 'b': [], 'c': []}
        self.p1_target_moves = {'a': [], 'b': [], 'c': []}
        self.p2_target_moves = {'a': [], 'b': [], 'c': []}
        self.p1_observationsSet = {}
        self.p2_observationsSet = {}

        # used to track two turn moves, not sent to neural network
        self.p2_is_random = True

        self.p1_action_request = ActionRequest()
        self.p2_action_request = ActionRequest()
        self.step_uuid = (str(uuid.uuid4()))
        self.p1_transcript = ''
        self.p2_transcript = ''
        self.p1_reward = 0
        self.p2_reward = 0

        self.p1_kifu_transcript = ''
        self.p2_kifu_transcript = ''
        self.gen = GEN.EIGHT
        self.gametype = GameType.SINGLES
        self.gametype_to_use = self.gametype
        self.tier = 'Ubers'
        #not sent to neural network
        #Yawn and perish are reset at the beginning of each turn.
        #game will update them each turn

        self.transcripto = []
        self.should_self_print = True
        # used to keep which requests we need to ask for.
        self.p1_open_request = {'a':False, 'b':False, 'c':False}
        self.p2_open_request = {'a':False, 'b':False, 'c':False}
        # switching moves

        #Not sent to neural network. used for forced switches so we dont request more actions
        self.p1_is_waiting = False
        self.p2_is_waiting = False


        self.request_outputs = []
        self.team_pokemon_metrics =  {}

        self.twitch_pending_summary = None
        self.twitch_pending_battle_summary = None
        self.p1_rewards_tracker = None
        self.p2_rewards_tracker = None
        self.match_summary = None
        self.field_summary = None
        self.p1_summary = None
        self.p2_summary = None
        self.categories_length = 0
        self.obs_length = 0

    def summary_printout(self):
        p1_shield_message = 'P1 shields: safeguard: %r, lightscreen: %r, reflect: %r, tailwind: %r, auraviel: %r' % (self.p1_safeguard, self.p1_lightscreen, self.p1_reflect, self.p1_tailwind, self.p1_aurora_veil)
        p2_shield_message = 'P2 shields: safeguard: %r, lightscreen: %r, reflect: %r, tailwind: %r, auraviel: %r' % (self.p2_safeguard, self.p2_lightscreen, self.p2_reflect, self.p2_tailwind, self.p2_aurora_veil)
        p1_import_message = 'P1 imports: used_z_move: %r, used_mega: %r, has_rocks: %r, has_web: %r, spikes: %d, toxic_spikes: %d' % (self.p1_used_zmove, self.p1_used_mega, self.p1_has_rocks, self.p1_has_web, self.p1_spikes, self.p1_toxic_spikes)
        p2_import_message = 'P2 imports: used_z_move: %r, used_mega: %r, has_rocks: %r, has_web: %r, spikes: %d, toxic_spikes: %d' % (self.p2_used_zmove, self.p2_used_mega, self.p2_has_rocks, self.p2_has_web, self.p2_spikes, self.p2_toxic_spikes)
        print(p1_shield_message)
        print(p2_shield_message)
        print(p1_import_message)
        print(p2_import_message)
        print('p1 trapped', self.p1_trapped)
        print('p2 trapped', self.p2_trapped)

    def printo_magnet(self, message):
        message = message.strip()
        if message == '' or self.should_self_print == False:
#        if message == '':
            return
        player_regex = '_p_'  # for player replace with nothing, for agent replace with opposing
        agent_regex = '_a_'  # for player replace with opposing, for agent replace with nothing
        message = message.replace('_p1_', '')
        message = message.replace('_p2_', 'Opposing ')

        print(message)

    def append_to_transcript(self, message):
        message = message.strip()
        if message == '':
            return
        player_regex = '_p1_'  # for player replace with nothing, for agent replace with opposing
        agent_regex = '_p2_'  # for player replace with opposing, for agent replace with nothing
        self.p1_transcript = '%s\n%s' % (self.p1_transcript, message)
        self.p1_transcript = self.p1_transcript.replace('_p1_', '')
        self.p1_transcript = self.p1_transcript.replace('_p2_', 'Opposing ')

        # apply reverse logic.
        self.p2_transcript = '%s\n%s' % (self.p2_transcript, message)
        self.p2_transcript = self.p2_transcript.replace('_p2_', '')
        self.p2_transcript = self.p2_transcript.replace('_p1_', 'Opposing ')


    def apply_reward_config(self, reward_config):
        self.reward_config.update(reward_config)


    def reset(self, random_style, gametype, p2_is_random, should_print=False):
        self.clear_everything()
        self.random_style = random_style
        self.should_self_print = should_print
        self.p2_is_random = p2_is_random
        self.gametype = gametype

        if self.simulate != None:
            self.simulate.stdin.close()
            self.simulate.stdout.close()
            self.simulate.stderr.close()
            self.simulate.kill()
        simulate = subprocess.Popen(["node", "./pokemon-showdown/pokemon-showdown", "simulate-battle"],
#        simulate = subprocess.Popen(["./Pokemon-Showdown/pokemon-showdown", "simulate-battle"],
                    stdin =subprocess.PIPE,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    universal_newlines=True,
                    bufsize=0)
        self.simulate = simulate

        if self.gametype in [GameType.SINGLES]:
            # gen8randomdoubles
            if self.gametype == GameType.SINGLES:
    #            print('Starting a Singles Match')
                self.simulate.stdin.write('>start {"formatid":"gen8randombattle"}\n')
            else:
    #            print('Starting a Doubles Match')
                self.simulate.stdin.write('>start {"formatid":"gen8randomdoublesbattle"}\n')
            self.simulate.stdin.write('>reward %s\n' % (json.dumps(self.reward_config)))
            self.simulate.stdin.write('>player p1 {"name":"Alice"}\n')
            self.simulate.stdin.write('>player p2 {"name":"Bob"}\n')
    #        self.simulate.stdin.write('>encoders\n')
        elif self.gametype == GameType.EXPERIMENTAL_SINGLES:
            # gen8randomdoubles
            idx = np.random.choice(len(SUPPORTED_FORMATS))
            selected_format = SUPPORTED_FORMATS[idx]
            self.simulate.stdin.write('>expstart {"formatid":"%s"}\n' % (selected_format))
#            self.simulate.stdin.write('>expplayer unused\n')
            if selected_format in TEAM_PREVIEW_FORMATS:
                self.simulate.stdin.write('>p1 team 123456\n')
                self.simulate.stdin.write('>p2 team 123456\n')
            self.simulate.stdin.write('>reward %s\n' % (json.dumps(self.reward_config)))
            print('chosen format: %s' % (selected_format))

        self.transcripto = []
        self.request_outputs = []

        self.process_til_turn_1()
        # Register positional metrics immediately

    def close(self):
        print('closing state')
        if self.simulate != None:
            self.simulate.stdin.close()
            self.simulate.stdout.close()
            self.simulate.stderr.close()
            self.simulate.kill()



    def write_step_team_data(self, data_to_write):
        return
        metrics_filename = 'step_by_step%s.json' % self.step_uuid
        kifu_dir = './stepy/'
        if not os.path.exists(os.path.dirname(kifu_dir)):
            os.makedirs(os.path.dirname(kifu_dir))

        with open(kifu_dir+metrics_filename,'a') as outfile_metrics:
            outfile_metrics.write(data_to_write)
            outfile_metrics.write('\n\n')

#        print('updated step data:', metrics_filename)

    def stockpile_p2_decisions(self):
        for position in ['a']:
            if self.p2_open_request[position] and (not self.p2_is_waiting or self.p2_must_switch[position]):

                action_index, target_enum = self.sample_actions(position=position, is_p1_perspective=False)
                valid_moves_for_gen = get_actions_for_gen(self.gen.value, self.gametype.value)

                p2_action_raw = Action(valid_moves_for_gen[action_index])

                self.apply_action_decision(p2_action_raw, target_enum, False)
                self.record_kifu(p2_action_raw, target_enum, position, False)

    @property
    def shape(self):
        # player has 6 pokemon with 16 slots
        # computer agent has 6 pokemon with 11 slots since some info hidden.
#        return (len(self.encode()['combined']), )
        return (len(self.encode()), )

    def encode(self, includeTranscript=False):
        """
        Convert current state into numpy array.
        """

        is_player_1 = self.get_player_for_next_request() == 'p1'
        request_position = self.get_position_for_current_request(is_player_1)
        if request_position is None:
            request_position = 'a'

#        print('self.p2_valid_moves', self.p2_valid_moves)
#        print('self.p2_target_moves', self.p2_target_moves)
#        print('self.p1_valid_moves', self.p1_valid_moves)
#        print('self.p1_target_moves', self.p1_target_moves)

        valid_moves = self.p2_valid_moves[request_position]
        valid_targets = self.p2_target_moves[request_position]
        observation = self.p2_observations
        transcript = self.p2_kifu_transcript
        reward_tracker = self.p2_rewards_tracker
        raw_observations = self.p2_raw_observations
        raw_labels = self.p2_raw_labels
        if is_player_1:
            valid_moves = self.p1_valid_moves[request_position]
            valid_targets = self.p1_target_moves[request_position]
            observation = self.p1_observations
            transcript = self.p1_kifu_transcript
            reward_tracker = self.p1_rewards_tracker
            raw_observations = self.p1_raw_observations
            raw_labels = self.p1_raw_labels


        results = {
            'transcript': transcript,
            'player': self.get_player_for_next_request(),
            'observation': observation,
            'combined': np.concatenate([observation, valid_moves]),
            'cat_length':self.categories_length,
            'full_obs_len':self.obs_length,
            'p1_rewards_tracker':self.p1_rewards_tracker,
            'p2_rewards_tracker':self.p2_rewards_tracker,
            'reward_tracker':reward_tracker,
            'match_summary':self.match_summary,
            'field_summary':self.field_summary,
            'p1_summary':self.p1_summary,
            'p2_summary':self.p2_summary,
            'raw_observations':raw_observations,
            'raw_labels':raw_labels,
            'twitch_summary':self.twitch_pending_summary,
            'twitch_battle_summary':self.twitch_pending_battle_summary,
            'raw_length':(self.obs_length-self.categories_length),
            'valid_onehot_moves': valid_moves,
            'valid_onehot_targets': valid_targets,
        }
        return results

        return self.get_observation(request_position, is_player_1, includeTranscript)

    def step(self, action_enum, target_enum, is_player_1):
        # increment turns

        if self.p2_is_random:
            self.stockpile_p2_decisions()
            self.take_action_if_ready(False)


        self.apply_action_decision(action_enum, target_enum, is_player_1)

        self.take_action_if_ready(is_player_1)


        skip_update = self.skip_update_sequence()
#        print('skipping update:', skip_update)

        output = ''
        update_complete = False
        turn_complete = False
        winner = None
        done = False
        self.write_step_team_data('before main: self.p1_open_request:%s' % (self.p1_open_request))
        self.write_step_team_data('before main: self.p2_open_request:%s' % (self.p2_open_request))
#        print('before main: self.p1_open_request:%s' % (self.p1_open_request))
#        print('before main: self.p2_open_request:%s' % (self.p2_open_request))
        if not skip_update:
            self.steps += 1
        while not skip_update and not update_complete:
            skip_update = False
#            print('self.p1_open_request', self.p1_open_request)
#            print('self.p2_open_request', self.p2_open_request)
            output = self.simulate.stdout.readline().strip()
#            print(output)
            self.transcripto.append(output)
            self.request_outputs.append(output)
            self.write_step_team_data('from main:\n%s' % (output))
#            if self.display_everything:
#                print('self.request_outputs: %s' % self.request_outputs)

            if '|turn|' in output:
                self.turns += 1

            if self.display_everything:
                # work around for avoid printing logs
                if '["processing: |t:' not in output and 'p2_team_pokemon_5_first_switched_turn' not in output:
                    print('main output: %s' % output)

            if output == 'sideupdate':
                p1_is_trapped = self.process_sideupdate()
                if p1_is_trapped:
#                    print('p1_is_trapped', p1_is_trapped)
                    # must distinguish between p2 random trapped
                    # and manual p1/p2 trapped

                    # assume whoever has open request is trapped.
                    if (self.p1_open_request['a'] or self.p1_open_request['b'] or self.p1_open_request['c']):
                        break
                    if (self.p2_open_request['a'] or self.p2_open_request['b'] or self.p2_open_request['c']):
                        if self.p2_is_random:
                            self.stockpile_p2_decisions()
                            self.take_action_if_ready(False)
                        else:
                            # cant do anything until we get a new move for p2.
                            break


            if output == 'update':
                turn_complete = self.process_update()
                # if a faint happened, we need to keep going for the upkeep
                update_complete = True

            if 'winner' in output.strip(): #'|win|' in output or '|tie|' in output:
#                print('sequence over')
#                self.summary_printout()
                winner_json = json.loads(output)
                winner = winner_json['winner']
                done = True
                break

            # If p1 is waiting, request p2 actions
            if self.p1_is_waiting and (self.p2_open_request['a'] or self.p2_open_request['b'] or self.p2_open_request['c']):
                # if p2 chooses bad move, assume a loop would keep polling
                if self.p2_is_random:
                    self.p1_is_waiting = False
                    self.stockpile_p2_decisions()
                    self.take_action_if_ready(False)
                else:
                    # cant do anything until we get a new move for p2.
                    break
                # poll for new info.
                update_complete = False
            elif self.p1_is_waiting or not (self.p1_open_request['a'] or self.p1_open_request['b'] or self.p1_open_request['c']):
                #p2 may not received open request yet
                # undo update complete
                # p1 also needs to wait for updates
                update_complete = False
#            print('end main: self.p1_open_request:%s' % (self.p1_open_request))
#            print('end main: self.p2_open_request:%s' % (self.p2_open_request))
#            print('end main: self.p1_is_waiting:%s' % (self.p1_is_waiting))
#            print('end main: self.p2_is_waiting:%s' % (self.p2_is_waiting))


        self.configure_action_request_position()

        # Penalty for taking too long
        if (self.steps >= 80 and self.p2_is_random) or self.steps >= 120:
            print(' Match taking too long')
            done = True
            self.p1_reward = -1
            self.p2_reward = -1
            winner = 'p2'

        win_reward = self.reward_config['win_reward']
        #reward quick matches
        if done and self.turns <= 30:
#            print('Quick match bonus for: %s: random_style: %s' % (winner, self.random_style))
            win_reward = self.reward_config['quick_match_under_30_turns']

        """
        if done and 'Alice' in winner:
            self.p1_reward += win_reward
            self.p2_reward -= win_reward
            self.p1_rewards_tracker['win_reward'].append(win_reward)
            self.p2_rewards_tracker['win_reward'].append(-win_reward)
        if done and 'Bob' in winner:
            self.p2_reward += win_reward
            self.p1_reward -= win_reward
            self.p1_rewards_tracker['win_reward'].append(-win_reward)
            self.p2_rewards_tracker['win_reward'].append(win_reward)

        attack_reward = self.reward_config['attack_reward']
        switch_penalty = self.reward_config['switch_penalty']
        #reward for attacking
        if is_player_1:
            metrics_prefix = 'p1'
            if action_enum in ATTACK_ACTIONS:
                self.p1_reward += attack_reward
            #penalty for switching if not forced
            if action_enum in SWITCH_ACTIONS and self.p1_must_switch['a'] == False:
                self.p1_reward -= switch_penalty

        else:
            if action_enum in ATTACK_ACTIONS:
                self.p2_reward += attack_reward

            if action_enum in SWITCH_ACTIONS and self.p2_must_switch['a'] == False:
                self.p2_reward -= switch_penalty
        """

        if is_player_1:
            return self.p1_reward, done, winner
        else:
            return self.p2_reward, done, winner

    # turn 1 is unique. by the time  of the sideupdate p1 and p2,
    # we dont even know who we're fighting against. This would cripple
    # ai's decision on who to use. Lazy work around make ai p2, but then same
    # situation would arise in bot vs bot fights
    def process_til_turn_1(self):
        output = None
        seeking_encoders = True
        while output != '|turn|1':
            output = self.simulate.stdout.readline().strip()
            # KeyError: 'Sirfetch’d'
            output = output.replace('’', '\'')
#            print(output)

            if output == 'sideupdate':
                self.process_sideupdate()

            if re.search(encoders_regex, output):
                if seeking_encoders:
                    print(output)


            # turn 1 doesnt process update
#            if output == 'update':
#                self.process_update()

    # only used for flushing
    def process_update(self):
        # consume next line since it is only pipe
        output = self.simulate.stdout.readline().strip()
        # KeyError: 'Sirfetch’d'
        output = output.replace('’', '\'')

        update_finished = False

        while output != '':
            output = self.simulate.stdout.readline().strip()
            # KeyError: 'Sirfetch’d'
            output = output.replace('’', '\'')
#            print('output', output)

            if re.search(update_complete_regex, output):
#                print('update finished')
                update_finished = True

        return update_finished


    def process_sideupdate(self):
        player = output = self.simulate.stdout.readline().strip()
        output = self.simulate.stdout.readline().strip()
        # KeyError: 'Sirfetch’d'
        output = output.replace('’', '\'')
        #reset only relevant player
        self.transcripto.append(player)
        self.transcripto.append(output)
        self.request_outputs.append(player)
        self.request_outputs.append(output)
#        self.write_step_team_data('from process_sideupdate:\n%s' % (output))

        if self.display_everything:
#            print('everything')
            if '|observation|' not in output:
                print('process_sideupdate')
                print(player)
                print(output)

#        if not re.search(observation_regex, output):
#            print(output)

        if re.search(wait_regex, output):
            # depending on player, enter wait loop. else continue
            if 'p1' in player:
                self.p1_is_waiting = True
            else:
                self.p2_is_waiting = True
            self.update_player_side(player, output)
            return

        if re.search(force_switch_regex, output):
            switch_details = json.loads(output.split('|')[2])['forceSwitch']
            positions = ['a']
            #mark player as need to switch
            # reset trapped. i.e. killed by wobbuffet
            if 'p1' in player:
                for idx, switch in enumerate(switch_details):
                    self.p1_open_request[positions[idx]] = switch
                    # Maybe other pokemon are trapped by other slot
            elif 'p2' in player:
                for idx, switch in enumerate(switch_details):
                    self.p2_open_request[positions[idx]] = switch
                    # Maybe other pokemon are trapped by other slot
            self.update_player_side(player, output)
            return


        if re.search(observation_regex, output):
            self.update_player_observation(player, output)
            return

        if re.search(trapped_regex_1, output) or re.search(trapped_regex_2, output):
            _empty = self.simulate.stdout.readline().strip()
            _sideupdate = self.simulate.stdout.readline().strip()
            _player = self.simulate.stdout.readline().strip()
            _output = self.simulate.stdout.readline().strip()
            _output = _output.replace('’', '\'')
            self.update_player_observation(_player, _output)
            _empty = self.simulate.stdout.readline().strip()
            _sideupdate = self.simulate.stdout.readline().strip()
            _player = self.simulate.stdout.readline().strip()
            _output = self.simulate.stdout.readline().strip()
            _output = _output.replace('’', '\'')
            self.update_player_side(_player, _output)
            return True

        # If we get here, we know we got a valid move for both parties
        self.p1_is_waiting = False
        self.p2_is_waiting = False
        self.update_player_side(player, output)

    def update_player_observation(self, player, output):
        main_key = '%s_%s' % (self.gen.value, self.gametype_to_use.name())
        all_observations_json = json.loads(output.split('|')[2])
#        print(all_observations_json)

        observation_json = all_observations_json[main_key]

        if self.display_everything:
            print('transcript %s' % observation_json['transcript'])

        if 'p1' in player:
            self.p1_observationsSet = observation_json
            self.p1_observations = observation_json['observation']
            self.p1_valid_moves = observation_json['valid_moves']
            self.p1_raw_observations = observation_json['raw_observation']
            self.p1_raw_labels = observation_json['raw_labels']
            self.p1_target_moves = observation_json['valid_targets']
            self.p1_kifu_transcript = observation_json['transcript']
            self.p1_reward = observation_json['reward']
            self.p1_rewards_tracker = observation_json['reward_tracker']
        else:
            self.p2_observationsSet = observation_json
            self.p2_observations = observation_json['observation']
            self.p2_valid_moves = observation_json['valid_moves']
            self.p2_raw_observations = observation_json['raw_observation']
            self.p2_raw_labels = observation_json['raw_labels']
            self.p2_target_moves = observation_json['valid_targets']
            self.p2_kifu_transcript = observation_json['transcript']
            self.p2_reward = observation_json['reward']
            self.p2_rewards_tracker = observation_json['reward_tracker']

        self.raw_kifu_labels = observation_json['raw_labels']
        self.categories_length = observation_json['categoryLength']
        self.obs_length = len(observation_json['raw_labels'])
#        self.rewards.append(observation_json['reward'])

#        print('observation', observation_json['observation'])
#        print('raw_observation', observation_json['raw_observation'])
#        print('raw_labels', observation_json['raw_labels'])
#        print('reward', observation_json['reward'])
#        print('categoryLength', observation_json['categoryLength'])

        """
        if observation_json['reward'] == 0:
            print('player', player)
            print('request_status', observation_json['request_status'])
            print('transcript', observation_json['transcript'])
            print('transcript', observation_json['reward_tracker'])
            print()
        """


    def update_player_side(self, player, output):
        if self.display_everything:
            print(player)
            print(output)

#        print('update_player_side')
#        print(player)
#        print(output)
#        print('update_player_side end')
        player_details_str = output
        # Piece1 is just the request
        try:
            player_details_json = json.loads(player_details_str.split('|')[2])
        except Exception as e:
            print("player_details_str", player_details_str)
            print("player_details_str.split('|')", player_details_str.split('|'))
            raise e


        # if waiting, dont update active pokemon
        if 'active' in player_details_json:
            attacks_json = player_details_json['active']
            #update active pokemon attacks
            positions = ['a']
            for i in range(len(attacks_json)):
                # Update based on fainted logic here
                position = positions[i]
                if 'p1' in player:
                    action_request = self.p1_action_request
                    self.p1_open_request[positions[i]] = True
                    action_request.active_pokemon_actions[position] = Action.Pass
                else:
                    action_request = self.p2_action_request
                    self.p2_open_request[positions[i]] = True
                    action_request.active_pokemon_actions[position] = Action.Pass

    def take_action_if_ready(self, is_player_1):
        if self.is_player_ready_for_action(is_player_1):

            player = 'p1'
            action_request = self.p1_action_request
            if not is_player_1:
                action_request = self.p2_action_request
                player = 'p2'

            # reset waiting
            if is_player_1:
                self.p2_is_waiting = False
            else:
                self.p1_is_waiting = False

            attack_commands = []
            should_replace_second_switch_with_pass = False
            should_replace_third_switch_with_pass = False
            for position in ['a']:
                # in the event of moves like uturn, potentially only one side gets changed.
                if action_request.active_pokemon_actions[position] == Action.Not_Decided:
                    continue
                action = action_request.active_pokemon_actions[position]
                target = action_request.active_pokemon_targets[position]
                command_text = get_action_text_for_action_and_target(player, action, target.get_target_index(position), False)

                # Skip scenario where both pokemon switch to the last remaining unfainted pokemon
                # use position a since position a resets by the time position b rolls around
                if position == 'a' and action_request.active_pokemon_actions['a'] == action_request.active_pokemon_actions['b'] \
                    and action_request.active_pokemon_actions['a'] in SWITCH_ACTIONS:
                    should_replace_second_switch_with_pass = True

                if position == 'a' and action_request.active_pokemon_actions['a'] == action_request.active_pokemon_actions['b'] \
                    and action_request.active_pokemon_actions['a'] in SWITCH_ACTIONS:
                    should_replace_third_switch_with_pass = True

                # need to reset just in case u turn is used
                # dont want to combine to commands again
                action_request.active_pokemon_actions[position] = Action.Not_Decided
                action_request.active_pokemon_targets[position] = SELECTABLE_TARGET.DO_NOT_SPECIFY

                attack_commands.append(command_text)

            # remove >p2/>p1 from second command
            if len(attack_commands) == 2:
                attack_commands[1] = attack_commands[1].replace('>p1 ', '').replace('>p2 ','')
            if len(attack_commands) == 3:
                attack_commands[1] = attack_commands[1].replace('>p1 ', '').replace('>p2 ','')
                attack_commands[2] = attack_commands[2].replace('>p1 ', '').replace('>p2 ','')

            if len(attack_commands) > 0:
                merged_commads = ','.join(attack_commands)
                # remove space before comma
                merged_commads = merged_commads.replace(' ,', ',')
#                print('merged_commads: ', merged_commads)
#>> battle-gen8doublesubers-1165808370|/choose pass,switch 3|13
                # insert pass instead
                if should_replace_second_switch_with_pass:
                    merged_commads = merged_commads.split(',')[0]
                    merged_commads = '%s,pass' % (merged_commads)
#                    print('new merged_commads: ', merged_commads)

                """
                if is_player_1:
                    self.p1_reward = 0
                else:
                    self.p2_reward = 0
                """

#                print('merged_commads: ', merged_commads)
                self.write_step_team_data('%s %s' % ('merged_commads: ', merged_commads))
                self.request_outputs.append(merged_commads)
                self.simulate.stdin.write(merged_commads+'\n')

    def record_kifu(self, action, target, position, p1_perspective):
        valid_moves = self.p1_valid_moves[position]
        valid_targets  = self.p1_target_moves[position]
        observation = self.p1_observations
        raw_obs = self.p1_raw_observations
        if not p1_perspective:
            valid_moves = self.p2_valid_moves[position]
            valid_targets  = self.p2_target_moves[position]
            observation = self.p2_observations
            raw_obs = self.p2_raw_observations

        valid_moves_for_gen = get_actions_for_gen(self.gen.value, self.gametype.value)

        action_index = valid_moves_for_gen.index(action)


        if p1_perspective:
            kifu_obs = observation + valid_moves + [self.p1_kifu_transcript] + [action_index] + [target.value]
            self.p1_kifu.append(kifu_obs)
            self.p1_raw_kifu.append(raw_obs)

        else:
            kifu_obs = observation + valid_moves + [self.p2_kifu_transcript] + [action_index] + [target.value]
            self.p2_kifu.append(kifu_obs)
            self.p2_raw_kifu.append(raw_obs)


    def get_position_for_current_request(self, is_player_1):

        if is_player_1:
            if self.p1_open_request['a']:
                return 'a'
        else:
            if self.p2_open_request['a']:
                return 'a'
        return None

    def get_player_for_next_request(self):
        if self.p2_is_waiting or (self.p1_open_request['a']):
            return 'p1'
        if self.p1_is_waiting or (self.p2_open_request['a']):
            return 'p2'
        return 'p1'

        # Called before step returns, to be ready for observation
    def configure_action_request_position(self):

        current_player_str = self.get_player_for_next_request()
        is_player_1 = current_player_str == 'p1'

        action_request = self.p1_action_request
        ally_slot = SELECTABLE_TARGET.ALLY_SLOT_1
        if not is_player_1:
            action_request = self.p2_action_request
            ally_slot = SELECTABLE_TARGET.ALLY_SLOT_2

        action_request.action_for_position = ally_slot

    def apply_action_decision(self, action_enum, target_enum, is_player_1):
        action_request = self.p1_action_request
        open_request = self.p1_open_request
        if not is_player_1:
            action_request = self.p2_action_request
            open_request = self.p2_open_request

        request_position = self.get_position_for_current_request(is_player_1)
        if open_request[request_position]:
            self.record_kifu(action_enum, target_enum, request_position, is_player_1)
            open_request[request_position] = False
            action_request.active_pokemon_actions[request_position] = action_enum
            action_request.active_pokemon_targets[request_position] = target_enum


    def is_player_ready_for_action(self, is_player_1):
        if is_player_1:
            if self.p1_is_waiting or (self.p1_open_request['a']):
                return False
        else:
            if self.p2_is_waiting or (self.p2_open_request['a']):
                return False
        return True

    def skip_update_sequence(self):
        if (self.p1_open_request['a']):
            return True
        if (self.p2_open_request['a']):
            return True
        return False

    def get_valid_moves_for_player(self, position='a', is_p1_perspective=True):

        valid_moves = self.p1_valid_moves[position]
        valid_targets  = self.p1_target_moves[position]
        if not is_p1_perspective:
            valid_moves = self.p2_valid_moves[position]
            valid_targets  = self.p2_target_moves[position]

        valid_moves_for_gen = get_actions_for_gen(self.gen.value, self.gametype.value)

        valid_moves_and_targets_enums = []
        for idx, action_bit in enumerate(valid_moves):
            target_enums = []
#            print('action_bit', action_bit)
            if action_bit == 1:
                action_enum = valid_moves_for_gen[idx]
                if len(valid_targets) > 0:
                    for idx, target_bit in enumerate(valid_targets[idx]):
                        if target_bit == 1:
                            target_enums.append(SELECTABLE_TARGET(idx))
                if len(target_enums) == 0:
                    target_enums = [SELECTABLE_TARGET.DO_NOT_SPECIFY]
                valid_moves_and_targets_enums.append((action_enum, target_enums))
#        print('valid_moves_and_targets_enums', valid_moves_and_targets_enums)
        return valid_moves_and_targets_enums



#        for pkmn in pokemon:


    def sample_actions(self, position='a', is_p1_perspective=True):
        actions_targets = self.get_valid_moves_for_player(position, is_p1_perspective)
#        print('p1_perspective', is_p1_perspective, actions)
        weights = [action.get_base_weight() for action, _ in actions_targets]
        if self.random_style == RANDOM_STYLES.PRIORITY_ATTACK:
            weights = [action.get_attack_priority_weight() for action, _ in actions_targets]
#            print('using get_attack_priority_weight distribution')
        elif self.random_style == RANDOM_STYLES.TIL_LAST_BREATH:
            weights = [action.get_till_last_breath_weight() for action, _ in actions_targets]
#            print('using get_till_last_breath_weight distribution')
        weights = np.asarray(weights)/sum(weights)

        valid_moves = self.p1_valid_moves
        valid_targets  = self.p1_target_moves
        if not is_p1_perspective:
            valid_moves = self.p2_valid_moves
            valid_targets  = self.p2_target_moves
#        print('is_p1_perspective', is_p1_perspective)
#        print('actions_targets', actions_targets)
#        print('valid_moves', valid_moves)
#        print('valid_targets', valid_targets)

        idx = np.random.choice(len(actions_targets), p=weights)
        action_target = actions_targets[idx]

        all_targets = action_target[1]

        # select a random target
        idx = np.random.choice(len(all_targets))
        selected_target = all_targets[idx]
#        print('sample action', action_target)
#        print('sample selected_target', selected_target)

#        print('action', action_target[0])
#        print('selected_target', selected_target)
#        print('all_targets', all_targets)
        valid_moves_for_gen = get_actions_for_gen(self.gen.value, self.gametype.value)

        action_index = valid_moves_for_gen.index(action_target[0])

        return (action_index, selected_target)

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

    def __init__(self, random_style=RANDOM_STYLES.NORMAL_RANDOM, use_network_model=False):
        self.random_style = random_style
        # if network exists, use that decide moves. Otherwise use random move.
        self._state = EnvironState( self.random_style)

        self.action_space = gym.spaces.Discrete(n=len(Action)-2)
#        self.observation_space = gym.spaces.Discrete(n=self._state.shape[0])
        self.observation_space = gym.spaces.Box(low=0, high=255, shape=(1, self._state.shape[0]), dtype=np.float32)
        self.seed()
        self.use_network_model2 = use_network_model
        print('style',random_style)
        print('use network',use_network_model)



    def step(self, action_as_int, target_as_int, player_str):
#        print('pre action_as_int',action_as_int)
        invalid_move_neg_reward = 0
#        print('post p2_action',p2_action)
#        print('post self.use_network_model2',self.use_network_model2)
#        print('p1 availables: ', self._state.get_valid_moves_for_player(position='a', is_p1_perspective=True))
#        p1_action = get_sample_action('p1', self._state.sample_actions(position='a', is_p1_perspective=True))
        valid_moves_for_gen = get_actions_for_gen(self._state.gen.value, self._state.gametype.value)

        action_enum = Action(valid_moves_for_gen[action_as_int])
        target_enum = SELECTABLE_TARGET(target_as_int)
        is_player_1 = player_str == 'p1'
        request_position = self._state.get_position_for_current_request(is_player_1)

        actions_targets = self._state.get_valid_moves_for_player(position=request_position, is_p1_perspective=is_player_1)
        selection_valid = False
        for act, targets in actions_targets:
            if action_enum == act:
                for target in targets:
                    if target_enum == target:
                        selection_valid = True
                        break

        if not selection_valid:
            if PRINT_INVALID_CHOICE_MESSAGE:
                print('Tried using %s, will not choose random action' % (action_enum))
                print('p1 should availables: ', self._state.get_valid_moves_for_player(position=request_position, is_p1_perspective=is_player_1))

            if CHOOSE_RANDOM_MOVE_FOR_INVALID_ACTION:
                old_action = action_enum
                old_target = target_enum
                action_index, target_enum = self._state.sample_actions(position=request_position, is_p1_perspective=is_player_1)
                valid_moves_for_gen = get_actions_for_gen(self._state.gen.value, self._state.gametype.value)

                action_enum = Action(valid_moves_for_gen[action_index])
                print('Tried using %s, using %s instead' % (old_action, action_enum))
                print('Target Tried using %s, using %s instead' % (old_target, target_enum))
                print('p1 should availables: ', self._state.get_valid_moves_for_player(position=request_position, is_p1_perspective=is_player_1))
                #Punish invalid moves
            invalid_move_neg_reward = -1
            # Punish struggle heavily
    #        if action_enum == Action.Attack_Struggle:
    #            neg_reward = -150
    #            print('p1 why struggle? availables: ', self._state.get_valid_moves_for_player(position=request_position, is_p1_perspective=is_player_1))
    #            print('last 12 requests', self._state.request_outputs[-12:])

        # process only is action is valid or random is allowed
        winner = None
        done = False
        if selection_valid or CHOOSE_RANDOM_MOVE_FOR_INVALID_ACTION:
            reward, done, winner = self._state.step(action_enum, target_enum, is_player_1)

        if invalid_move_neg_reward != 0:
            reward = invalid_move_neg_reward

        obs = self._state.encode(includeTranscript=True)
        info = {"transcript":obs['transcript'], "valid_onehot_moves": obs['valid_onehot_moves'],
         "valid_onehot_targets": obs['valid_onehot_targets'],
         'player': obs['player'],
         "p1_rewards_tracker": obs['p1_rewards_tracker'],
         "p2_rewards_tracker": obs['p2_rewards_tracker'],
         "reward_tracker": obs['reward_tracker'],
         "match_summary": obs['match_summary'],
         "field_summary": obs['field_summary'],
         "p1_summary": obs['p1_summary'],
         "p2_summary": obs['p2_summary'],
         "raw_observations": obs['raw_observations'],
         "raw_labels": obs['raw_labels'],
         "twitch_summary": obs['twitch_summary'],
         "twitch_battle_summary": obs['twitch_battle_summary'],
         'cat_length':obs['cat_length'], 'full_obs_len':obs['full_obs_len'], 'raw_length':obs['raw_length'],
         'winner': winner}
#        print('valid_onehot', obs['valid_onehot_player'])
        # only add kifu on last turn

        #return same state with negative reward
        if not selection_valid and not CHOOSE_RANDOM_MOVE_FOR_INVALID_ACTION:
            return obs['combined'], invalid_move_neg_reward, False, info

        if done:
            info['kifu'] = self._state.p1_kifu
            self.handle_session_completed(upload_and_store=False)

        return obs['combined'], reward, done, info

    def handle_session_completed(self, upload_and_store=False):
#        return
        ts = time.time()
        self.write_kifu_to_file(ts, self._state.p1_kifu, self._state.p2_kifu)
        self.write_raw_kifu_to_file(ts, self._state.raw_kifu_labels, self._state.p1_raw_kifu, self._state.p2_raw_kifu)


        return
        self.preprocess_metrics()
        self.write_metrics_to_file(ts)

        if upload_and_store:
            self.prepare_metrics_for_db()
            self.post_metrics_to_db()

            upload_session_files(self.tracking_metrics[METRIC_USER_ID_KEY], self.tracking_metrics[METRIC_SESSION_ID_KEY], self.tracking_metrics[METRIC_UPLOAD_FILENAMES_KEY])

        # metrics check
        for key in self.tracking_metrics:
            if self.tracking_metrics[key] == -1 or self.tracking_metrics[key] == 0 or self.tracking_metrics[key] == []:
                continue
#            print(key, self.tracking_metrics[key])

    def write_kifu_to_file(self, timestamp,  p1_kifu, p2_kifu):


        p1_filename = 'kifu_%.3f_p1_%s.csv' % (timestamp, self.session_id)
        p2_filename = 'kifu_%.3f_p2_%s.csv' % (timestamp, self.session_id)

        self.add_upload_filename(p1_filename)
        self.add_upload_filename(p2_filename)

        kifu_dir = '/tmp/kifu/'
        if not os.path.exists(os.path.dirname(kifu_dir)):
            os.makedirs(os.path.dirname(kifu_dir))

        p1_df = pd.DataFrame(p1_kifu)
        p1_df.to_csv(kifu_dir+p1_filename, header=False, index=None)

        p2_df = pd.DataFrame(p2_kifu)
        p2_df.to_csv(kifu_dir+p2_filename, header=False, index=None)

#        print('kifus_written to folder')

    def write_raw_kifu_to_file(self, timestamp, raw_labels, p1_raw_kifu, p2_raw_kifu):

        p1_filename = 'raw_kifu_%.3f_p1_%s.csv' % (timestamp, self.session_id)
        p2_filename = 'raw_kifu_%.3f_p2_%s.csv' % (timestamp, self.session_id)

        self.add_upload_filename(p1_filename)
        self.add_upload_filename(p2_filename)

        kifu_dir = '/tmp/kifu/'
        if not os.path.exists(os.path.dirname(kifu_dir)):
            os.makedirs(os.path.dirname(kifu_dir))

        p1_df = pd.DataFrame(p1_raw_kifu, columns=raw_labels)
        p1_df.to_csv(kifu_dir+p1_filename, index=None)

        p2_df = pd.DataFrame(p2_raw_kifu, columns=raw_labels)
        p2_df.to_csv(kifu_dir+p2_filename, index=None)

#        print('kifus_written to folder')

    def write_metrics_to_file(self, timestamp):
        metrics_filename = 'session_metrics_%.3f_p1_%s.json' % (timestamp, self.session_id)
        kifu_dir = '/tmp/kifu/'
        if not os.path.exists(os.path.dirname(kifu_dir)):
            os.makedirs(os.path.dirname(kifu_dir))
        self.add_upload_filename(metrics_filename)

        with open(kifu_dir+metrics_filename,'w') as outfile_metrics:
            json.dump(self.tracking_metrics, outfile_metrics, sort_keys=True, indent=4)

        metric_data = json.dumps(self.tracking_metrics, sort_keys=True)
#        print('Session Metrics:\n', metric_data)

    def add_upload_filename(self, filename):
        pass
#        self.tracking_metrics[METRIC_UPLOAD_FILENAMES_KEY].append(filename)

    def preprocess_metrics(self):
        # cleanup p2_switch_tracker, p1_switch_tracker
        for key in ['p1_switch_tracker', 'p2_switch_tracker']:
            new_list = []
            element_last_turn = False
            for item in self.tracking_metrics[key]:
                if element_last_turn:
                    element_last_turn = False
                    continue

                new_list.append(item)
                if item is not None:
                    element_last_turn = True

            self.tracking_metrics[key] = new_list

        # convert sets to lists
        for key in self.tracking_metrics:
            if isinstance(self.tracking_metrics[key], set):
                self.tracking_metrics[key] = list(self.tracking_metrics[key])

    def prepare_metrics_for_db(self):
        for key in self.tracking_metrics:

            item = self.tracking_metrics[key]
            if isinstance(item, collections.abc.Sequence) and not isinstance(item, str):
                new_items = []
                for sub_item in item:
                    # subteam does not need processing
                    sub_item_id = sub_item
                    # Keep NULLs in tact
                    if sub_item is None:
                        pass
                    elif key in ITEMS_KEY:
                        sub_item_id = id_for_item_name(sub_item)
                    elif key in SEEN_POKEMON_KEY:
                        sub_item_id = id_for_pokemon_name(sub_item)
                    elif key in SEEN_ABILITIES_KEY:
                        sub_item_id = id_for_ability_name(sub_item)
                    elif key in SEEN_ATTACKS_KEY:
                        sub_item_id = id_for_attack_name(sub_item)

                    new_items.append(sub_item_id)

                #replace old list with new list of ids
                item = new_items

            self.tracking_metrics[key] = item

    def post_metrics_to_db(self):
        # register team
        p1_team_for_registration = get_pokemon_team_as_json(self._state.p1_pokemon)
        print('p1_team_for_registration', p1_team_for_registration)

        print('team_metrics', json.dumps(p1_team_for_registration))
        print('session_metrics', json.dumps(self.tracking_metrics))

        DBManager().store_game_session(self.tracking_metrics, p1_team_for_registration, None)


    def reset(self, reward_config, user_id, group_label, session_label, p2_is_random, desired_bot_style=None, desired_gametype_style=None):
        idx = np.random.choice(len(ALL_RANDOM_STYLES), p=ALL_RANDOM_WEIGHTS)
        self.random_style = ALL_RANDOM_STYLES[idx]
        if desired_bot_style in RANDOM_STYLES._value2member_map_ and RANDOM_STYLES(desired_bot_style) in ALL_RANDOM_STYLES:
            self.random_style = RANDOM_STYLES(desired_bot_style)
        gametype = GameType.SINGLES
        if desired_gametype_style in GameType._value2member_map_ and GameType(desired_gametype_style) in ALL_GAME_TYPES:
            gametype = GameType(desired_gametype_style)
#        print('using style:', self.random_style)
#        print('desired_bot_style:', desired_bot_style)
#        print('using_game_type:', gametype)


        self._state.reset(self.random_style, gametype, p2_is_random)
        self._state.apply_reward_config(reward_config)
        self.session_id = str(uuid.uuid4())
        self.user_id = user_id


        obs = self._state.encode(includeTranscript=True)
        info = {"transcript":obs['transcript'], "valid_onehot_moves": obs['valid_onehot_moves'],
         "valid_onehot_targets": obs['valid_onehot_targets'],
         'player': obs['player'],
         "p1_rewards_tracker": obs['p1_rewards_tracker'],
         "p2_rewards_tracker": obs['p2_rewards_tracker'],
         "match_summary": obs['match_summary'],
         "field_summary": obs['field_summary'],
         "p1_summary": obs['p1_summary'],
         "p2_summary": obs['p2_summary'],
         "twitch_summary": obs['twitch_summary'],
         "twitch_battle_summary": obs['twitch_battle_summary'],
         'cat_length':obs['cat_length'], 'full_obs_len':obs['full_obs_len'], 'raw_length':obs['raw_length'],
         'winner': None}

        return obs['combined'], 0.0, False, info

    def get_current_transcript(self):
        return self._state.state_transcript

    def get_current_transcript(self):
        return self._state.state_transcript

    def sample_actions(self, player_str):
        is_player_1 = player_str == 'p1'
        request_position = self._state.get_position_for_current_request(is_player_1)

        action_index, target = self._state.sample_actions(position=request_position, is_p1_perspective=is_player_1)
        return action_index, target.value

    def seed(self, seed=None):
        self.np_random, seed1 = seeding.np_random(seed)
        seed2 = seeding.hash_seed(seed1 + 1) % 2 ** 31
        return [seed1, seed2]

    def close(self):
        print('closing env')
        self._state.close()


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
    "terrain_weather_trigger": 25,
    "quick_match_under_30_turns": 60,
    "reflect_tailwind_etc_end": 10,
    "status_start": 15,
    "switch_penalty": 33,
    "taking_too_long_penalty_100_turns": 500,
    "taunt_begin": 10,
    "taunt_end": 5,
    "win_reward": 200,
    "yawn_success": 5,
    "used_ability": 10,
    "protection_bonus": 10,
    "stat_modified": 20,
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

AVAILABLE_AI_BOTS = [NORMAL_RANDOM, PRIORITY_ATTACK, TIL_LAST_BREATH, STRATEGIC_WITHDRAWAL]

#Communicates with the environment flask service through
# rest calls

SINGLES = 1
DOUBLES = 2
EXPERIMENTAL_SINGLES = 4

class PokeEnv(gym.Env):
    NETWORK_MODEL = None
    metadata = {'render.modes': ['human']}
    # Store later for other formats but not now
    #Gen Number
    # Game type singles, doubles, triples
    # Battle Format
    # Sleep mod rule. Anything goes, etc.

#    'pikachu': {'thundershock': 1}
#    p1 seen_attacks = {}

    def __init__(self,  model_server_url=MODEL_SERVER_URL, user_id="prime_13", session_label="Prime Field Device", group_label="AC2 Model V1", reward_config=REWARD_CONFIG, bot_stategries=AVAILABLE_AI_BOTS):
        obs, _, _, info = PokeSimEnv().reset({}, "user_id", "", "session_label", p2_is_random=False)

        self.group_label = group_label
        self.user_id = user_id
        self.session_label = session_label
        self.model_server_url = model_server_url
        self.action_space = gym.spaces.Discrete(n=len(info["valid_onehot_moves"]))
        self.observation_space = gym.spaces.Box(low=0, high=255, shape=(len(obs),), dtype=np.float32)
        self.reward_config=reward_config
        self.bot_stategries=bot_stategries
        self.poke_sim_env = PokeSimEnv()


    def get_params(self):
        return {
            'group_label': self.group_label,
            'session_label': self.session_label,
            'user_id': self.user_id,
            'bot_id': self.bot_id
        }


    # Checks for least recently used bot to avoid clashes
    # just here for consistency with remote
    def get_available_bot(self):
        pass


    # Checks for least recently used bot to avoid clashes
    def get_most_recent_session(self):
        params = self.get_params()
        url = 'get_last_user_session'
        raw_resp = self.fire_request(url, params)

        return raw_resp['download_url']



    def step(self, action, target, player):
        obs, reward, done, info = self.poke_sim_env.step(action, target, player)

        return np.asarray(obs), reward, done, info

    def reset(self, game_type=SINGLES, random_opponent=True, bot_style=None):
        if bot_style is None or bot_style not in AVAILABLE_AI_BOTS:
            idx = np.random.choice(len(AVAILABLE_AI_BOTS))
            bot_style = AVAILABLE_AI_BOTS[idx]

        obs, reward, done, info = self.poke_sim_env.reset(self.reward_config,self.user_id, self.group_label, self.session_label, desired_bot_style=bot_style, desired_gametype_style=game_type, p2_is_random=random_opponent)
        return np.asarray(obs), reward, done, info


    def sample_actions(self, player='p1'):
        action_as_int, target_as_int = self.poke_sim_env.sample_actions(player)
        return action_as_int, target_as_int


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
