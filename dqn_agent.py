import numpy as np
import torch as T
from deep_q_network import PokeDeepQNetwork
from deep_q_network_uriah import PokeDeepQNetworkUriah
from dueling_deep_q_network_uriah import PokeDuelingDeepQNetworkUriah
from replay_memory import PokeReplayBuffer

class DQNAgent():
    def __init__(self, gamma, epsilon, lr, n_actions, input_dims, mem_size, batch_size, eps_min=0.01, eps_dec=5e-7,
            replace=1000, algo=None, env_name=None, chkpt_dir='tmp/dqn'):

        self.gamma = gamma
        self.epsilon = epsilon
        self.lr = lr
        self.n_actions = n_actions
        self.batch_size = batch_size
        self.input_dims = input_dims
        self.eps_min = eps_min
        self.eps_dec = eps_dec
        self.replace_target_cnt = replace
        self.algo = algo
        self.env_name = env_name
        self.chkpt_dir = chkpt_dir
        self.action_space = [i for i in range(self.n_actions)]
        self.learn_step_counter = 0
        self.memory = PokeReplayBuffer(mem_size, input_dims, n_actions)

        self.q_eval = DeepQNetwork(self.lr, self.n_actions, input_dims=self.input_dims,
            name=self.env_name+'_'+self.algo+'_q_eval', chkpt_dir=self.chkpt_dir)

        self.q_next = DeepQNetwork(self.lr, self.n_actions, input_dims=self.input_dims,
            name=self.env_name+'_'+self.algo+'_q_next', chkpt_dir=self.chkpt_dir)

    def choose_action(self, observation):
        if np.random.random() > self.epsilon:
            state = T.tensor([observation], dtype=T.float).to(self.q_eval.device)
            actions = self.q_eval.forward(state)
            action = T.argmax(actions).item()
        else:
            action = np.random.choice(self.action_space)

        return action

    def store_transition(self, state, action, reward, state_, done):
        self.memory.store_transition(state, action, reward, state_, done)

    def sample_memory(self):
        state,action, reward, new_state, done = self.memory.sample_buffer(self.batch_size)

        states = T.tensor(state).to(self.q_eval.device)
        rewards = T.tensor(reward).to(self.q_eval.device)
        dones = T.tensor(done).to(self.q_eval.device)
        actions = T.tensor(action).to(self.q_eval.device)
        states_ = T.tensor(new_state).to(self.q_eval.device)

        return states, actions, rewards, states_, dones

    def replace_target_network(self):
        if self.learn_step_counter % self.replace_target_cnt == 0:
            self.q_next.load_state_dict(self.q_eval.state_dict())

    def decrement_epsilon(self):
        self.epsilon = self.epsilon - self.eps_dec if self.epsilon > self.eps_min else self.eps_min

    def save_models(self):
        self.q_eval.save_checkpoint()
        self.q_next.save_checkpoint()

    def load_models(self):
        self.q_eval.load_checkpoint()
        self.q_next.load_checkpoint()

    def learn(self):
        if self.memory.mem_cntr < self.batch_size:
            return

        self.q_eval.optimizer.zero_grad()

        self.replace_target_network()

        states, actions, rewards, states_, dones = self.sample_memory()

        indices = np.arange(self.batch_size)
        q_pred = self.q_eval.forward(states)[indices, actions]
        q_next = self.q_next.forward(states_).max(dim=1)[0]

        q_next[dones] = 0.0
        q_target = rewards +self.gamma*q_next

        loss = self.q_eval.loss(q_target, q_pred).to(self.q_eval.device)
        loss.backward()
        self.q_eval.optimizer.step()
        self.learn_step_counter += 1

        self.decrement_epsilon()


class PokeDQNAgent():
    def __init__(self, gamma, epsilon, lr, n_actions, input_dims, mem_size, batch_size, eps_min=0.01, eps_dec=5e-7,
            replace=1000, algo=None, env_name=None, chkpt_dir='tmp/dqn'):

        self.gamma = gamma
        self.epsilon = epsilon
        self.lr = lr
        self.batch_size = batch_size
        self.n_actions = n_actions
        self.input_dims = input_dims
        self.eps_min = eps_min
        self.eps_dec = eps_dec
        self.replace_target_cnt = replace
        self.algo = algo
        self.env_name = env_name
        self.chkpt_dir = chkpt_dir
        self.action_space = [i for i in range(self.n_actions)]
        self.learn_step_counter = 0
        self.memory = PokeReplayBuffer(mem_size, input_dims, n_actions)

        self.q_eval = PokeDeepQNetwork(self.lr, self.n_actions, input_dims=self.input_dims,
            name=self.env_name+'_'+self.algo+'_q_eval', chkpt_dir=self.chkpt_dir)

        self.q_next = PokeDeepQNetwork(self.lr, self.n_actions, input_dims=self.input_dims,
            name=self.env_name+'_'+self.algo+'_q_next', chkpt_dir=self.chkpt_dir)

    def choose_action(self, observation):
        if np.random.random() > self.epsilon:
            state = T.tensor([observation], dtype=T.float32).to(self.q_eval.device)
            actions = self.q_eval.forward(state)
            action = T.argmax(actions).item()
        else:
            action = np.random.choice(self.action_space)

        return action

    def store_transition(self, state, action, reward, state_, done):
        self.memory.store_transition(state, action, reward, state_, done)

    def sample_memory(self):
        state,action, reward, new_state, done = self.memory.sample_buffer(self.batch_size)

        states = T.tensor(state).to(self.q_eval.device)
        rewards = T.tensor(reward).to(self.q_eval.device)
        dones = T.tensor(done).to(self.q_eval.device)
        actions = T.tensor(action).to(self.q_eval.device)
        states_ = T.tensor(new_state).to(self.q_eval.device)

        return states, actions, rewards, states_, dones

    def replace_target_network(self):
        if self.learn_step_counter % self.replace_target_cnt == 0:
            self.q_next.load_state_dict(self.q_eval.state_dict())

    def decrement_epsilon(self):
        self.epsilon = self.epsilon - self.eps_dec if self.epsilon > self.eps_min else self.eps_min

    def save_models(self):
        self.q_eval.save_checkpoint()
        self.q_next.save_checkpoint()

    def load_models(self):
        self.q_eval.load_checkpoint()
        self.q_next.load_checkpoint()

    def learn(self):
        if self.memory.mem_cntr < self.batch_size:
            return

        self.q_eval.optimizer.zero_grad()

        self.replace_target_network()

        states, actions, rewards, states_, dones = self.sample_memory()

        indices = np.arange(self.batch_size)
        q_pred = self.q_eval.forward(states)[indices, actions]
        q_next = self.q_next.forward(states_).max(dim=1)[0]

        q_next[dones] = 0.0
        q_target = rewards +self.gamma*q_next

        loss = self.q_eval.loss(q_target, q_pred).to(self.q_eval.device)
        loss.backward()
        self.q_eval.optimizer.step()
        self.learn_step_counter += 1

        self.decrement_epsilon()

class PokeDDQNAgentUriah():
    def __init__(self, gamma, epsilon, lr, n_actions, input_dims, mem_size, batch_size, eps_min=0.01, eps_dec=5e-7,
            replace=1000, algo=None, env_name=None, reward_config_key=None, chkpt_dir='tmp/dqn', minimum_mem_for_enemy_action=1000):

        self.gamma = gamma
        self.epsilon = epsilon
        self.lr = lr
        self.batch_size = batch_size
        self.n_actions = n_actions
        self.input_dims = input_dims
        self.eps_min = eps_min
        self.eps_dec = eps_dec
        self.replace_target_cnt = replace
        self.algo = algo
        self.env_name = env_name
        self.chkpt_dir = chkpt_dir
        self.action_space = [i for i in range(self.n_actions)]
        self.learn_step_counter = 0
        self.memory = PokeReplayBuffer(mem_size, input_dims, n_actions)
        self.reward_config_key = reward_config_key
        self.minimum_mem_for_enemy_action = minimum_mem_for_enemy_action

        self.q_eval = PokeDuelingDeepQNetworkUriah(self.lr, self.n_actions, input_dims=self.input_dims,
            name=self.env_name+'_'+self.algo+'_'+str(self.lr)+'_'+str(self.gamma)+'_'+str(self.reward_config_key)+'_q_eval', chkpt_dir=self.chkpt_dir)

        self.q_next = PokeDuelingDeepQNetworkUriah(self.lr, self.n_actions, input_dims=self.input_dims,
            name=self.env_name+'_'+self.algo+'_'+str(self.lr)+'_'+str(self.gamma)+'_'+str(self.reward_config_key)+'_q_next', chkpt_dir=self.chkpt_dir)

        self.enemy_network = PokeDuelingDeepQNetworkUriah(self.lr, self.n_actions, input_dims=self.input_dims,
            name=self.env_name+'_'+self.algo+'_'+str(self.lr)+'_'+str(self.gamma)+'_'+str(self.reward_config_key)+'_q_enemy', chkpt_dir=self.chkpt_dir)
    
    def store_transition(self, state, action, reward, state_, done):
        self.memory.store_transition(state, action, reward, state_, done)

    def sample_memory(self):
        state,action, reward, new_state, done = self.memory.sample_buffer(self.batch_size)

        states = T.tensor(state).to(self.q_eval.device)
        rewards = T.tensor(reward).to(self.q_eval.device)
        dones = T.tensor(done).to(self.q_eval.device)
        actions = T.tensor(action).to(self.q_eval.device)
        states_ = T.tensor(new_state).to(self.q_eval.device)

        return states, actions, rewards, states_, dones

    def save_models(self):
        self.q_eval.save_checkpoint()
        self.q_next.save_checkpoint()

    def load_models(self):
        self.q_eval.load_checkpoint()
        self.q_next.load_checkpoint()


    def choose_action(self, observation):
        valid_moves = observation[-self.n_actions:]
        action = None
        #print('valid_moves', valid_moves)
        if np.random.random() > self.epsilon:
            state = np.array([observation], copy=False, dtype=np.float32)
            state_tensor = T.tensor(state).to(self.q_eval.device)
            _, advantages = self.q_eval.forward(state_tensor)

            action = T.argmax(advantages).item()
            #print('advantages', advantages)
            #print('ml action', action)
        else:
            pass
            #idx_nonzero, = np.nonzero(valid_moves)

            #action = np.random.choice(idx_nonzero)
            #print('ran action', action)

        return action

    def choose_enemy_action(self, observation):
        if self.memory.mem_cntr < self.minimum_mem_for_enemy_action:
            return None
        valid_moves = observation[-self.n_actions:]
        action = None
        #print('valid_moves', valid_moves)
        if np.random.random() > self.epsilon:
            state = np.array([observation], copy=False, dtype=np.float32)
            state_tensor = T.tensor(state).to(self.enemy_network.device)
            _, advantages = self.enemy_network.forward(state_tensor)

            action = T.argmax(advantages).item()
            #print('advantages', advantages)
            #print('ml action', action)
        else:
            pass
            #idx_nonzero, = np.nonzero(valid_moves)

            #action = np.random.choice(idx_nonzero)
            #print('ran action', action)

        return action

    def replace_target_network(self):
        if self.replace_target_cnt is not None and \
           self.learn_step_counter % self.replace_target_cnt == 0:
            self.q_next.load_state_dict(self.q_eval.state_dict())
            self.enemy_network.load_state_dict(self.q_eval.state_dict())

    def decrement_epsilon(self):
        self.epsilon = self.epsilon - self.eps_dec \
                           if self.epsilon > self.eps_min else self.eps_min

    def learn(self):
        if self.memory.mem_cntr < self.batch_size:
            return

        self.q_eval.optimizer.zero_grad()

        self.replace_target_network()

        states, actions, rewards, states_, dones = self.sample_memory()
        indices = np.arange(self.batch_size)

        V_s, A_s = self.q_eval.forward(states)
        V_s_, A_s_ = self.q_next.forward(states_)

        V_s_eval, A_s_eval = self.q_eval.forward(states_)

        q_pred = T.add(V_s,
                        (A_s - A_s.mean(dim=1, keepdim=True)))[indices, actions]

        q_next = T.add(V_s_, (A_s_ - A_s_.mean(dim=1, keepdim=True)))

        q_eval = T.add(V_s_eval, (A_s_eval - A_s_eval.mean(dim=1,keepdim=True)))

        max_actions = T.argmax(q_eval, dim=1)
        q_next[dones] = 0.0

        q_target = rewards + self.gamma*q_next[indices, max_actions]

        loss = self.q_eval.loss(q_target, q_pred).to(self.q_eval.device)
        loss.backward()
        self.q_eval.optimizer.step()
        self.learn_step_counter += 1

        self.decrement_epsilon()
