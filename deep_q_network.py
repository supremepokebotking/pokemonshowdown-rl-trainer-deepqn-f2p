import os
import torch as T
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim
import numpy as np
import torch.nn.functional as F

MM_EMBEDDINGS_DIM = 50
MM_MAX_WORD_SIZE = 20
MM_MAX_SENTENCE_SIZE = 200
MM_FEATURES_SIZE = 20000
MM_MAX_VOCAB_SIZE = 5000


# Pokemon Constants
POKEMON_MAX_WORD_SIZE = 20     # length limit per word/name/item/etc
POKEMON_MAX_VOCAB_SIZE = 1500  # limit used for item names, and pokemon names
POKEMON_MEDIUM_VOCAB_SIZE = 400  # limit used for pokemon abilities names
POKEMON_SMALL_VOCAB_SIZE = 30  # limit used for elements, status, weather, terrain, etc
POKEMON_EXTRA_SMALL_VOCAB_SIZE = 15  # limit used for elements, status, weather, terrain, etc
POKEMON_LARGE_EMBEDDINGS_DIM = 50
POKEMON_SMALL_EMBEDDINGS_DIM = 15
POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM = 3

POKEMON_FIELD_REMAINDER = 512
POKEMON_CAT_LENGTH = 238
POKEMON_NON_CAT_LENGTH = 389


SELECTABLE_TARGET_SIZE = 8
pokemon_category_embedding_shape = ( None, 1)
#pokemon_category_embedding_shape = ( 1)

action_space = 14

#ob_shape = ( None, 211 )
ob_shape = ( 211 )

#text_shape = ( None, 200 )
text_shape = ( 200 )

import torch
from torch import nn



def get_embedding_sizes():
    embeddings = []
    embeddings_shape = []
    embedding_sizes = []

    # Generations
    embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
    # Game Types
    embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
    #Tiers
    embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
    # Weather
    embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
    # Terrain
    embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
    # Room
    embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
    # Effective p1 a
    embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
    # Effective p2 a
    embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
    # p1 Pending Attacks A
    embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
    # p2 Pending Attacks A
    embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))

    # for each pokemon for player and agent
    for i in range(6):

        #name
        embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
        #status
        embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
        #first element
        embedding_sizes.append((POKEMON_SMALL_VOCAB_SIZE, POKEMON_SMALL_EMBEDDINGS_DIM))
        #second element
        embedding_sizes.append((POKEMON_SMALL_VOCAB_SIZE, POKEMON_SMALL_EMBEDDINGS_DIM))
        #ability
        embedding_sizes.append((POKEMON_MEDIUM_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
        #item
        embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
        #gender
        embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))

        # 4 attack slots
        for j in range(4):
            #name
            embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
            #element
            embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_SMALL_EMBEDDINGS_DIM))
            #category
            embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, 1))



    # for each pokemon for player and agent
    for i in range(6):

        #name
        embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
        #status
        embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))
        #first element
        embedding_sizes.append((POKEMON_SMALL_VOCAB_SIZE, POKEMON_SMALL_EMBEDDINGS_DIM))
        #second element
        embedding_sizes.append((POKEMON_SMALL_VOCAB_SIZE, POKEMON_SMALL_EMBEDDINGS_DIM))
        #ability
        embedding_sizes.append((POKEMON_MEDIUM_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
        #item
        embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
        #gender
        embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM))

        # 4 attack slots
        for j in range(4):
            #name
            embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_LARGE_EMBEDDINGS_DIM))
            #element
            embedding_sizes.append((POKEMON_MAX_VOCAB_SIZE, POKEMON_SMALL_EMBEDDINGS_DIM))
            #category
            embedding_sizes.append((POKEMON_EXTRA_SMALL_VOCAB_SIZE, 1))
    return embedding_sizes


class PokeDeepQNetwork(nn.Module):
    def __init__(self, lr, n_actions, name, input_dims, chkpt_dir):
        super(PokeDeepQNetwork, self).__init__()
        self.checkpoint_dir = chkpt_dir
        self.checkpoint_file = os.path.join(self.checkpoint_dir, name)

        self.embeddings = nn.ModuleList([nn.Embedding(categories, size) for categories,size in get_embedding_sizes()])
        n_emb = sum(e.embedding_dim for e in self.embeddings) #length of all embeddings combined
        # print('input_dims', input_dims)
        self.n_emb, self.n_cont = n_emb, input_dims[0] - POKEMON_CAT_LENGTH

        self.conv1_1 = nn.Conv1d(1, 256, kernel_size=1)
        self.conv1_2 = nn.Conv1d(256, 128, kernel_size=3)
        self.max_1 = nn.MaxPool1d(8)
        self.conv1_3 = nn.Conv1d(128, 128, kernel_size=2)
        self.conv1_4 = nn.Conv1d(128, 256, kernel_size=2)
        self.max_2 = nn.MaxPool1d(8)
        self.conv1_5 = nn.Conv1d(256, 256, kernel_size=1)
        self.conv1_6 = nn.Conv1d(256, 512, kernel_size=1)
        self.glob_1 = nn.AvgPool1d(kernel_size=1)
        self.drop = nn.Dropout(0.3)


        # This returns a tensor
        self.combined_dense_1 = nn.Linear(1024, 512)
        self.combined_dense_2 = nn.Linear(512, 256)
        self.combined_dense_3 = nn.Linear(256, 256)

        self.merged = torch.cat
        self.categorical_dense = nn.Linear(512, 512)
        self.non_categorical_dense_1 = nn.Linear(self.n_cont, 512)
        self.non_categorical_dense_2 = nn.Linear(512, 1024)
        self.non_categorical_dense_3 = nn.Linear(1024, 512)
        self.combined_fields = torch.cat

        # Note: no tf.get_variable(), just simple Keras API!
        self.hidden1 = nn.Linear(256, 128)#(combined_fields)
        self.hidden2 = nn.Linear(256, 128)
        self.value = nn.Linear(128, 1)
        # Logits are unnormalized log probabilities.
        self.logits = nn.Linear(128, n_actions)

        self.optimizer = optim.RMSprop(self.parameters(), lr=lr)
        self.loss = nn.MSELoss()
        self.device = T.device('cuda:0' if T.cuda.is_available() else 'cpu')
        self.to(self.device)


    def forward(self, full_obs):

        x_cat, x_cont = full_obs[:,0:POKEMON_CAT_LENGTH], full_obs[:,POKEMON_CAT_LENGTH:]
        x = [e(x_cat[:,i].int()) for i,e in enumerate(self.embeddings)]
        # print('x_cat shape(0)', x_cat.shape)
        # print('x_cont shape(0)', x_cont.shape)

        combined_embedding_fields = torch.cat(x, 1)
#         print('combined_embedding_fields shape', combined_embedding_fields.shape)
#         print('combined_embedding_fields unsqueeze(0)', combined_embedding_fields.unsqueeze(0).shape)
#         print('combined_embedding_fields transpose(0)', combined_embedding_fields.transpose(1,0).shape)
#         print('combined_embedding_fields permute(0)', combined_embedding_fields.permute(1,0).shape)
#         print('combined_embedding_fields permute(1,0).unsqueeze(0)', combined_embedding_fields.permute(1,0).unsqueeze(0).shape)
#         print('combined_embedding_fields permute(1,0).unsqueeze(0)', combined_embedding_fields.permute(0,1).unsqueeze(0).shape)
# #        conv = self.conv1_1(combined_embedding_fields.transpose(1, 0))
#         print('conv1_1 shape(0)', combined_embedding_fields.permute(1,0).unsqueeze(0).shape)
        # print('input :', combined_embedding_fields[:, None, :].shape)
        conv = self.conv1_1(combined_embedding_fields[:, None, :])
        # print('conv1_2 shape(0)', conv.shape)
        conv = self.conv1_2(conv)
        # print('max_1 shape(0)', conv.shape)
        conv = self.max_1(conv)
        conv = self.conv1_3(conv)
        conv = self.conv1_4(conv)
#        conv = self.max_2(conv)
        conv = self.conv1_5(conv)
        conv = self.conv1_6(conv)
        # print('before', conv.shape)
        # conv = self.glob_1(conv) # this was problem
        # print(torch.mean(conv[0, 0]))
        conv = F.adaptive_avg_pool2d(conv, (conv.shape[-2], 1))
        # print(conv[0, 0])

        # print('after', conv.shape)
        conv = self.drop(conv)

        conv = conv.view(conv.size()[0], -1)

        # print('ay tex', conv.shape)
        x = F.relu(self.categorical_dense(conv))
        y = F.relu(self.non_categorical_dense_1(x_cont))
        y = F.relu(self.non_categorical_dense_2(y))
        y = F.relu(self.non_categorical_dense_3(y))

        # print('x shape(0)', x.shape)
        # print('y shape(0)', y.shape)
        z = torch.cat([x, y], -1)
        # print('z shape(0)', z.shape)
        #z = y

        z = F.relu(self.combined_dense_1(z))
        z = F.relu(self.combined_dense_2(z))
        z = F.relu(self.combined_dense_3(z))
        hidden_logs = F.relu(self.hidden1(z))

        hidden_vals = F.relu(self.hidden2(z))

        returnlogs = self.logits(hidden_logs)

        returnvals = self.value(hidden_vals)

        return returnlogs

    def save_checkpoint(self):
        print('... saving checkpoint ...')
        T.save(self.state_dict(), self.checkpoint_file)

    def load_checkpoint(self):
        print('... loading checkpoinnt ...')
        self.load_state_dict(T.load(self.checkpoint_file))
