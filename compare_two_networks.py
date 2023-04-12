import numpy as np
from dqn_agent import PokeDDQNAgentUriah
from dueling_deep_q_network_uriah import PokeDuelingDeepQNetworkUriah
from utils import make_env, plot_learning_curve
from poke_server_env_jooony import *
import random
from scipy import stats

env = PokeEnv()
config = {}
state = env.reset(random_opponent=False)
action2 = None
rewards = 0
steps = 0
sample_obs = state
sample_obs = sample_obs[0]
print('sample_obs:\n')
print(sample_obs)
player='p1'
all_rewards = []
target = 0

import warnings
warnings.filterwarnings("ignore")

import os
if not os.path.exists('models'):
   os.makedirs('models')

if not os.path.exists('plots'):
   os.makedirs('plots')

if not os.path.exists('datasetgen'):
   os.makedirs('datasetgen')

if not os.path.exists('replay_history'):
   os.makedirs('replay_history')

DEFAULT_BATCH_SIZE = 32
DEFAULT_NUMBER_OF_TRAINING_GAMES = 2
DEFAULT_ROUND_ROBIN_GAMES = 15

class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)



result_scores_data = {
    
}
#Increase batch size if GPU can handle it

# Runs cycles for every model params config with every reward config with enemy as random and ai

import json
    
scores_per_configuration = {}
model_filenames = ["PokeEnv-v1_PokeDuelingDDQNEnemyAgent_0.001_1.4_config_ver_2_q_next", "PokeEnv-v1_PokeDuelingDDQNRandomAgent_0.001_0.5_config_ver_2_q_next"]

models_filenames_gammas = {}
models_filenames_lrs = {}
models_filenames_batchsizes = {}
models_filenames_enemyrands = {}
models_filenames_n_games = {}
models_filenames_model_filename = {}



# Create an empty dictionary to store the win/loss records
records = {}
matches_replay = {}
for team in model_filenames:
    records[team] = {}
    matches_replay[team] = []

import torch as T
def get_action_from_model(model, observation, n_actions):
    valid_moves = observation[-n_actions:]
    state = np.array([observation], copy=False, dtype=np.float32)
    state_tensor = T.tensor(state).to(model.device)
    _, advantages = model.forward(state_tensor)

    action = T.argmax(advantages).item()

    return action

#### Round robin continuation
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import itertools
# Clear Figure 2 with clf() function:
plt.clf()

import uuid

lr = 0.001
n_actions = env.action_space.n
input_dims = ((env.observation_space.shape))
chkpt_dir = 'models/'
round_robin_match_nums = DEFAULT_ROUND_ROBIN_GAMES
round_combination_pairs = list(itertools.combinations(range(len(model_filenames)), 2))

p1_actions = []
p2_actions = []
for i, j in round_combination_pairs:
    p1_model_filename = model_filenames[i]
    p2_model_filename = model_filenames[j]
    team1 = p1_model_filename
    team2 = p2_model_filename
    p1_model = PokeDuelingDeepQNetworkUriah(lr, n_actions, input_dims=input_dims,
            name=p1_model_filename, chkpt_dir=chkpt_dir)
    p2_model = PokeDuelingDeepQNetworkUriah(lr, n_actions, input_dims=input_dims,
            name=p2_model_filename, chkpt_dir=chkpt_dir)
    p1_model.load_checkpoint()
    p2_model.load_checkpoint()
    

    print(f"{team1} vs {team2}:")
    for _ in range(round_robin_match_nums):
        replay_filename = '%s.json' % (str(uuid.uuid4()))
        replay_data = {
            "obs": []
        }

        
        done = False
        score = 0
        observation, _, _, info = env.reset(random_opponent=False)
        player = info["player"]
        #env.update_reward_config(reward_config)
        steps = 0

        while not done:
            is_player_1 = "p1" in player
            replay_data["obs"].append(observation)
            if is_player_1:
                action = get_action_from_model(p1_model, observation, n_actions)
                print('p1 chose %s' % str(action) )
                matches_replay[team1].append({'obs': observation, 'action': action})
                p1_actions.append(action)
            else:
                action = get_action_from_model(p2_model, observation, n_actions)
                print('p2 chose %s' % str(action) )
                matches_replay[team2].append({'obs': observation, 'action': action})
                p2_actions.append(action)
            observation_, reward, done, info = env.step(action, target, player)

            observation = observation_
            # dont let p2 contribute to steps
            #update now
            player=info['player']
            is_player_1 = "p1" in player
            steps += 1
        
        with open('datasetgen/%s' % replay_filename, 'w', encoding='utf-8') as f:
            json.dump(replay_data, f, ensure_ascii=False, indent=4, cls=NumpyEncoder)


        
        result = info["winner"]
        print(f"match finished in {steps} steps {result} won")
        if result == 'p1' or result == 'Alice':
            # Team 1 wins
            if team2 not in records[team1]:
                records[team1][team2] = 1
            else:
                records[team1][team2] += 1
        elif result == 'Bob':
            # Team 2 wins
            if team1 not in records[team2]:
                records[team2][team1] = 1
            else:
                records[team2][team1] += 1


teams = model_filenames
# Convert the win/loss records to a pandas DataFrame
data = []
for i, team1 in enumerate(teams):
    for j, team2 in enumerate(teams):
        if i != j:
            wins = records[team1].get(team2, 0)
            losses = records[team2].get(team1, 0)
            data.append([team1, team2, wins, losses])
df = pd.DataFrame(data, columns=['Team 1', 'Team 2', 'Wins', 'Losses'])
df = df.pivot(index='Team 1', columns='Team 2', values='Wins')

# Create a heatmap of the win/loss records
heatmap_plot = sns.heatmap(df, annot=True, cmap="YlGnBu")
fig = heatmap_plot.get_figure()
fig.savefig("croundrobin_results.png") 

# Calculate the total wins for each team
wins = {}
for team in teams:
    wins[team] = sum(records[team].values())

# Sort the teams by their total wins
ranked_teams = sorted(wins.keys(), key=lambda x: wins[x], reverse=True)

f = open("cwinresults.txt", "w")

# Print the rankings
print("Win/Loss Records:")
f.write("Win/Loss Records:\n")
for i, team in enumerate(ranked_teams):
    f.write(f"{i+1}. {team}: {wins[team]} wins\n")
    print(f"{i+1}. {team}: {wins[team]} wins")
f.close()

with open('replay_history/replay_history.json', 'w', encoding='utf-8') as f:
    json.dump(matches_replay, f, ensure_ascii=False, indent=4, cls=NumpyEncoder)

print('p1_actions', p1_actions)
print('p2_actions', p2_actions)
