#from poke_env import *
from poke_server_env import *
import random



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

JUNK_TEST_REWARD_CONFIG = {
    "switch_penalty": 777,
}

MAX_REWARD = 250

env = PokeEnv(reward_config=JUNK_TEST_REWARD_CONFIG)
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

SHOW_REWARD_TRACKER = True
SHOW_FIELD_SUMMARY = True
SHOW_MATCH_SUMMARY = True
SHOW_PLAYER_SUMMARY = True
SHOW_WHICH_PLAYER = True
SHOW_TRANSCRIPT = True

extra_info_records = {}
extra_info_records_seqential = {}

for i in range(1):
    print(i)
    done = False
    state = env.reset(random_opponent=False)
    while not done:
    #    action1 = env.sample_actions()
        action, target = env.sample_actions(player)
        obs, reward, done, info = env.step(action, target, player)
        rewards += reward
        all_rewards.append(reward)
        player=info['player']
        steps += 1

        steps_key = ('%d' % steps).zfill(5)

        if 'reward_tracker' not in extra_info_records:
            extra_info_records["reward_tracker"] = []
        extra_info_records["reward_tracker"].append(info["reward_tracker"])

        if 'match_summary' not in extra_info_records:
            extra_info_records["match_summary"] = []
        extra_info_records["match_summary"].append(info["match_summary"])

        if 'field_summary' not in extra_info_records:
            extra_info_records["field_summary"] = []
        extra_info_records["field_summary"].append(info["field_summary"])

        if 'transcript' not in extra_info_records:
            extra_info_records["transcript"] = []
        extra_info_records["transcript"].append(info["transcript"])

        if 'p1_summary' not in extra_info_records:
            extra_info_records["p1_summary"] = []
        extra_info_records["p1_summary"].append(info["p1_summary"])

        if 'p2_summary' not in extra_info_records:
            extra_info_records["p2_summary"] = []
        extra_info_records["p2_summary"].append(info["p2_summary"])

        if 'reward' not in extra_info_records:
            extra_info_records["reward"] = []
        extra_info_records["reward"].append(reward)

        extra_info_records_seqential[steps_key] = {
            "reward_tracker": info["reward_tracker"],
            "match_summary": info["match_summary"],
            "field_summary": info["field_summary"],
            "transcript": info["transcript"],
            "p1_summary": info["p1_summary"],
            "p2_summary": info["p2_summary"],
            "reward": reward,
        }
        print('player turn:', info["player"])
        print('transcript:', info["transcript"])


    if i % 100 == 0:
        print('finished match:', i)

print('reward', rewards)
print('steps', steps)
print('all_rewards', (all_rewards))
print('min', min(all_rewards))
print('max', max(all_rewards))

all_rewards.sort()
mid = len(all_rewards) // 2
res = (all_rewards[mid] + all_rewards[~mid]) / 2

# Printing result
print("Median of list is : " + str(res))


with open("extra_info_records_seqential.json",'w') as outfile_metrics:
    json.dump(extra_info_records_seqential, outfile_metrics, sort_keys=True, indent=4)

with open("extra_info_records.json",'w') as outfile_metrics:
    json.dump(extra_info_records, outfile_metrics, sort_keys=True, indent=4)
