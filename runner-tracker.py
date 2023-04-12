DEFAULT_REWARD_CONFIG2 = {
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

#from poke_env import *
from poke_server_env_jooony import *
import random

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
for i in range(1):
    print(i)
    done = False
    env.update_reward_config(DEFAULT_REWARD_CONFIG2)
    state = env.reset(random_opponent=False)
    while not done:
    #    action1 = env.sample_actions()
        action, target = env.sample_actions(player)
        obs, reward, done, info = env.step(action, target, player)
        action = info['sample_action']
        rewards += reward
        all_rewards.append(reward)
        reward_tracker = {key: value for key, value in info['reward_tracker'].items() if value}
        p1_reward_tracker = {key: value for key, value in info['p1_rewards_tracker'].items() if value}
        p2_reward_tracker = {key: value for key, value in info['p2_rewards_tracker'].items() if value}
        
        rt_sum = sum(sum(value) for value in reward_tracker.values()) / 150
        rt1_sum = sum(sum(value) for value in p1_reward_tracker.values()) / 150
        rt2_sum = sum(sum(value) for value in p2_reward_tracker.values()) / 150
        print(f'rt tracker rewards. rt_sum: {rt_sum}, rt1_sum: {rt1_sum}, rt2_sum: {rt2_sum}')

        print('action', action, 'reward', reward, 'reward_tracker', reward_tracker)
        if player == "p1":
            print('p1 reward tracker', p1_reward_tracker)
        else:
            print('p2 reward tracker', p2_reward_tracker)
        print(info['transcript'])                   
        player=info['player']
        steps += 1
        import time
        time.sleep(1)
    if i % 100 == 0:
        print('finished match:', i)
print('reward', rewards)
print('steps', steps)
print('all_rewards', (all_rewards))
print('min', min(all_rewards))
print('max', max(all_rewards))
print('info',info)

all_rewards.sort()
mid = len(all_rewards) // 2
res = (all_rewards[mid] + all_rewards[~mid]) / 2

# Printing result
print("Median of list is : " + str(res))
