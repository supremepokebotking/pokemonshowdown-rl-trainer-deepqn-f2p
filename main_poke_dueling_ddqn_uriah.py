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

if not os.path.exists('replay_history'):
   os.makedirs('replay_history')

if not os.path.exists('datasetgen'):
   os.makedirs('datasetgen')

DEFAULT_BATCH_SIZE = 32
DEFAULT_NUMBER_OF_TRAINING_GAMES = 2
DEFAULT_ROUND_ROBIN_GAMES = 5

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


WIPE_ASSETS_EACH_RUN = True
if WIPE_ASSETS_EACH_RUN:
    rdir = 'models'
    for f in os.listdir(rdir):
        os.remove(os.path.join(rdir, f))

    rdir = 'plots'
    for f in os.listdir(rdir):
        os.remove(os.path.join(rdir, f))

    rdir = 'replay_history'
    for f in os.listdir(rdir):
        os.remove(os.path.join(rdir, f))

    rdir = 'datasetgen'
    for f in os.listdir(rdir):
        os.remove(os.path.join(rdir, f))

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

reward_configs = {
    "default_config": {
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
    },
    "config_ver_1": {
        "attack_immune": 40,
        "attack_missed": 25,
        "attack_resisted": 30,
        "attack_reward": 30,
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
        "pokemon_damaged": 15,
        "pokemon_heal": 10,
        "terrain_weather_trigger": 15,
        "quick_match_under_30_turns": 60,
        "reflect_tailwind_etc_end": 10,
        "status_start": 15,
        "switch_penalty": 22,
        "taking_too_long_penalty_100_turns": 500,
        "taunt_begin": 10,
        "taunt_end": 5,
        "win_reward": 200,
        "yawn_success": 15,
        "used_ability": 10,
        "protection_bonus": 10,
        "stat_modified": 20,
    },
    "config_ver_2": {
        "attack_immune": 40,
        "attack_missed": 25,
        "attack_resisted": 30,
        "attack_reward": 50,
        "attack_supereffective": 40,
        "confused_begin": 10,
        "confused_end": 10,
        "critical": 50,
        "curestatus": 20,
        "damage_by_hazards_opponent_ability_or_items": 20,
        "damage_by_own_item": 2,
        "destiny_bond_start": 2,
        "fainted": 100,
        "hazards_and_safeguard_etc_start": 30,
        "hazards_removed": 10,
        "health_change_base": 5,
        "illusion_broken": 15,
        "item_knockedoffed": 15,
        "minor_switch": 7,
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
        "used_ability": 25,
        "protection_bonus": 10,
        "stat_modified": 20,
    },
}



model_param_configs = [
    {
        "gamma": 0.999,
        "epsilon": 1,
        "lr": 0.001,
        "eps_dec": 1e-4,
        "batch_size": DEFAULT_BATCH_SIZE,
        "eps_min": 0.1,
        "load_checkpoint":False,
        "n_games":DEFAULT_NUMBER_OF_TRAINING_GAMES,
    },
    {
        "gamma": 0.9,
        "epsilon": 0.8,
        "lr": 0.001,
        "eps_dec": 1e-4,
        "batch_size": DEFAULT_BATCH_SIZE,
        "eps_min": 0.05,
        "load_checkpoint":False,
        "n_games":DEFAULT_NUMBER_OF_TRAINING_GAMES,
    },
    {
        "gamma": 0.99,
        "epsilon": 1,
        "lr": 0.0001,
        "eps_dec": 1e-4,
        "batch_size": DEFAULT_BATCH_SIZE,
        "eps_min": 0.04,
        "load_checkpoint":False,
        "n_games":DEFAULT_NUMBER_OF_TRAINING_GAMES,
    },
]

"""

reward_configs = {
    "config_ver_2": {
        "attack_immune": 40,
        "attack_missed": 25,
        "attack_resisted": 30,
        "attack_reward": 50,
        "attack_supereffective": 40,
        "confused_begin": 10,
        "confused_end": 10,
        "critical": 50,
        "curestatus": 20,
        "damage_by_hazards_opponent_ability_or_items": 20,
        "damage_by_own_item": 2,
        "destiny_bond_start": 2,
        "fainted": 100,
        "hazards_and_safeguard_etc_start": 30,
        "hazards_removed": 10,
        "health_change_base": 5,
        "illusion_broken": 15,
        "item_knockedoffed": 15,
        "minor_switch": 7,
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
        "used_ability": 25,
        "protection_bonus": 10,
        "stat_modified": 20,
    },
}

model_param_configs = [
    {
        "gamma": 0.99,
        "epsilon": 1,
        "lr": 0.0001,
        "eps_dec": 1e-4,
        "batch_size": 32,
        "eps_min": 0.04,
        "load_checkpoint":False,
        "n_games":1,
    },
]
"""

result_scores_data = {
    
}
#Increase batch size if GPU can handle it

# Runs cycles for every model params config with every reward config with enemy as random and ai

import json
with open('run_configurations.json', 'w', encoding='utf-8') as f:
    json.dump({"reward_configs": reward_configs, "model_params": model_param_configs}, f, ensure_ascii=False, indent=4)

    
scores_per_configuration = {}
model_filenames = []

models_filenames_gammas = {}
models_filenames_lrs = {}
models_filenames_batchsizes = {}
models_filenames_enemyrands = {}
models_filenames_n_games = {}
models_filenames_model_filename = {}

if __name__ == '__main__':
#    env = make_env('PongNoFrameskip-v4')
    for model_params_config in model_param_configs:
        for reward_config_key in reward_configs:
            reward_config = reward_configs[reward_config_key]
            for random_opponent in [True, False]:
            #for random_opponent in [True]:
                random_name = 'Random'
                if random_opponent == False:
                    random_name = 'Enemy'
                

                best_score = -np.inf
                load_checkpoint = False
                n_games = 1
                if "n_games" in model_params_config:
                    n_games = model_params_config["n_games"]

                agent = PokeDDQNAgentUriah(gamma=model_params_config["gamma"], epsilon=model_params_config["epsilon"], lr=model_params_config["lr"], input_dims=((env.observation_space.shape)), n_actions=env.action_space.n, mem_size=50000, eps_min=model_params_config["eps_min"], batch_size=model_params_config["batch_size"], replace=1000, eps_dec=model_params_config["eps_dec"], chkpt_dir='models/', algo='PokeDuelingDDQN%sAgent' % (random_name), env_name='PokeEnv-v1', reward_config_key=reward_config_key)
                if load_checkpoint:
                    agent.load_models()

                fname = agent.algo + '_' + agent.env_name + '_gamma' + str(agent.gamma) + '_lr' + str(agent.lr) + '_' +\
                    '_' + str(n_games) + 'games_' + reward_config_key + '_reward_' + '_opponent:' + random_name

                figure_file = 'plots/' + fname + '.png'

                models_filenames_gammas[fname] = model_params_config["gamma"]
                models_filenames_lrs[fname] = model_params_config["lr"]
                models_filenames_batchsizes[fname] = model_params_config["batch_size"]
                models_filenames_enemyrands[fname] = random_name
                models_filenames_n_games[fname] = n_games
                models_filenames_model_filename[fname] = agent.q_next.name

                n_steps = 0
                scores, eps_history, steps_array = [], [], []
                print('\nBeginning sequence for the following config', fname,'\n')
                model_filenames.append(fname)

                for i in range(n_games):
                    done = False
                    score = 0
                    observation, _, _, info = env.reset(random_opponent=random_opponent)
                    player = info["player"]
                    env.update_reward_config(reward_config)

                    while not done:
                        is_player_1 = "p1" in player
                        if is_player_1:
                            action = agent.choose_action(observation)
                        else:
                            action = agent.choose_enemy_action(observation)
                        if action is None:
                            action = info["sample_action"]
                        observation_, reward, done, info = env.step(action, target, player)
                        # dont let p2 contribute to reward 
                        if is_player_1:
                            score += reward
                        
                        if not load_checkpoint and is_player_1:
                            agent.store_transition(observation, action, reward, observation_, int(done))
                            agent.learn()

                        observation = observation_
                        # dont let p2 contribute to steps
                        if is_player_1:
                            n_steps += 1
                        #update now
                        player=info['player']
                        is_player_1 = "p1" in player
                    scores.append(score)
                    steps_array.append(n_steps)

                    avg_score = np.mean(scores[-100:])
                    print('episode ', i, 'score: ', score, 'average score %.1f best score %.1f epsiolon %.2f' % (avg_score, best_score, agent.epsilon), 'steps ', n_steps)
                    if avg_score > best_score:
                        if not load_checkpoint:
                            agent.save_models()
                        best_score = avg_score

                    eps_history.append(agent.epsilon)

                plot_learning_curve(steps_array, scores, eps_history, figure_file)
                scores_per_configuration[fname] = scores
                last_20_scores = scores[-20:]
                result_scores_data[fname] = {}
                result_scores_data[fname]["mean_last_20"] = np.mean(last_20_scores)
                result_scores_data[fname]["median_last_20"] = np.median(last_20_scores)
                result_scores_data[fname]["mode_last_20"] = stats.mode(last_20_scores)
                result_scores_data[fname]["mean"] = np.mean(scores)
                result_scores_data[fname]["median"] = np.median(scores)
                result_scores_data[fname]["mode"] = stats.mode(scores)

with open('scores_per_configuration.json', 'w', encoding='utf-8') as f:
    json.dump(scores_per_configuration, f, ensure_ascii=False, indent=4)

with open('result_scores_data.json', 'w', encoding='utf-8') as f:
    json.dump(result_scores_data, f, ensure_ascii=False, indent=4, cls=NumpyEncoder)

with open('model_configurations.json', 'w', encoding='utf-8') as f:
    json.dump({"gammas": models_filenames_gammas, "lrs": models_filenames_lrs, "batchsizes": models_filenames_batchsizes, "enemyrands": models_filenames_enemyrands, "n_games": models_filenames_n_games}, f, ensure_ascii=False, indent=4)
    
print('all generated models filenames', model_filenames)
#https://colab.research.google.com/drive/1D1TwINQNwoL8l_3dMtlIqtgbZ6EIPXA9?usp=sharing


# Create an empty dictionary to store the win/loss records
records = {}
for team in model_filenames:
    records[team] = {}

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

lr = 0.001
n_actions = env.action_space.n
input_dims = ((env.observation_space.shape))
chkpt_dir = 'models/'
round_robin_match_nums = DEFAULT_ROUND_ROBIN_GAMES
round_combination_pairs = list(itertools.combinations(range(len(model_filenames)), 2))
for i, j in round_combination_pairs:
    p1_model_filename = models_filenames_model_filename[model_filenames[i]]
    p2_model_filename = models_filenames_model_filename[model_filenames[j]]
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
        done = False
        score = 0
        observation, _, _, info = env.reset(random_opponent=False)
        player = info["player"]
        env.update_reward_config(reward_config)
        steps = 0

        while not done:
            is_player_1 = "p1" in player
            if is_player_1:
                action = get_action_from_model(p1_model, observation, n_actions)
            else:
                action = get_action_from_model(p2_model, observation, n_actions)
            observation_, reward, done, info = env.step(action, target, player)

            observation = observation_
            # dont let p2 contribute to steps
            #update now
            player=info['player']
            is_player_1 = "p1" in player
            steps += 1

        
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
fig.savefig("roundrobin_results.png") 

# Calculate the total wins for each team
wins = {}
for team in teams:
    wins[team] = sum(records[team].values())

# Sort the teams by their total wins
ranked_teams = sorted(wins.keys(), key=lambda x: wins[x], reverse=True)

f = open("winresults.txt", "w")

# Print the rankings
print("Win/Loss Records:")
f.write("Win/Loss Records:\n")
for i, team in enumerate(ranked_teams):
    f.write(f"{i+1}. {team}: {wins[team]} wins\n")
    print(f"{i+1}. {team}: {wins[team]} wins")
f.close()


