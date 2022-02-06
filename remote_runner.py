#from poke_env import *
from poke_env import *
import random

env = PokeSimEnv()
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
for i in range(100):
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
