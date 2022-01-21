import gym
import logging
import numpy as np
import tensorflow as tf
import tensorflow.keras.layers as kl
import tensorflow.keras.losses as kls
import tensorflow.keras.optimizers as ko

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

SELECTABLE_TARGET_SIZE = 8
pokemon_category_embedding_shape = ( None, 1)
#pokemon_category_embedding_shape = ( 1)

tokenizer = Tokenizer(num_words=5000)

action_space = 14

#ob_shape = ( None, 211 )
ob_shape = ( 211 )

#text_shape = ( None, 200 )
text_shape = ( 200 )

class ProbabilityDistribution(tf.keras.Model):
  def call(self, logits, **kwargs):

    # Sample a random categorical action from the given logits.
    return tf.squeeze(tf.random.categorical(new_logits, 1), axis=-1)

# LSTM Layer
#def lstm_layer(vocab_size=MM_MAX_VOCAB_SIZE, word_len_limit=MM_MAX_WORD_SIZE, input_length=MM_MAX_SENTENCE_SIZE):
#	return LSTM(Embedding(vocab_size, word_len_limit, input_length=input_length, mask_zero=True), dropout=0.2, recurrent_dropout=0.2, return_sequences=True)
def lstm_layer(em_input, vocab_size=MM_MAX_VOCAB_SIZE, word_len_limit=MM_MAX_WORD_SIZE, input_length=MM_MAX_SENTENCE_SIZE):
    print('em shape', em_input.shape)
    embedding = Embedding(vocab_size, word_len_limit, input_length=input_length )(em_input)
    print('emb shape', embedding.shape)
    return LSTM(units=100, dropout=0.2, recurrent_dropout=0.2, return_sequences=True)(embedding)



class Model(tf.keras.Model):
  def __init__(self, num_actions):
    super().__init__('mlp_policy')
    embeddings = []
    embeddings_shape = []

    # Generations
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    generations_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(generations_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    # Game Types
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    gametypes_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(gametypes_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    #Tiers
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    tiers_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(tiers_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    # Weather
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    weather_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(weather_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    # Terrain
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    terrain_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(terrain_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    # Room
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    room_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(room_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))



    # Effective p1 a
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    effective_p1_a_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(effective_p1_a_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    # Effective p2 a
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    effective_p2_a_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(effective_p2_a_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    # p1 Pending Attacks A
    embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
    seen_attacks_a_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(seen_attacks_a_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    # p2 Pending Attacks A
    embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
    seen_attacks_a_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
    embeddings.append(seen_attacks_a_embedding)
    embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

    # for each pokemon for player and agent
    for i in range(6):

        embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
        player_pokemon_name_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(player_pokemon_name_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
        player_pokemon_status_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(player_pokemon_status_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_SMALL_EMBEDDINGS_DIM
        player_pokemon_first_element_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(player_pokemon_first_element_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_SMALL_EMBEDDINGS_DIM
        player_pokemon_second_element_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(player_pokemon_second_element_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
        player_pokemon_abilities_embedding = Embedding(POKEMON_MEDIUM_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(player_pokemon_abilities_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
        player_pokemon_items_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(player_pokemon_items_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
        player_pokemon_genders_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(player_pokemon_genders_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        # 4 attack slots
        for j in range(4):
            embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
            player_attack_slot_1_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
            embeddings.append(player_attack_slot_1_embedding)
            embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

            embedding_size = POKEMON_SMALL_EMBEDDINGS_DIM
            player_attack_slot_1_element_embedding = Embedding(POKEMON_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
            embeddings.append(player_attack_slot_1_element_embedding)
            embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

            embedding_size = 1
            player_attack_slot_1_category_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
            embeddings.append(player_attack_slot_1_category_embedding)
            embeddings_shape.append(Reshape(target_shape=(embedding_size,)))



    # for each pokemon for player and agent
    for i in range(6):

        embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
        agent_pokemon_name_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(agent_pokemon_name_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
        agent_pokemon_status_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(agent_pokemon_status_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))


        embedding_size = POKEMON_SMALL_EMBEDDINGS_DIM
        agent_pokemon_first_element_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(agent_pokemon_first_element_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_SMALL_EMBEDDINGS_DIM
        agent_pokemon_second_element_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(agent_pokemon_second_element_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
        agent_pokemon_abilities_embedding = Embedding(POKEMON_MEDIUM_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(agent_pokemon_abilities_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
        agent_pokemon_items_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(agent_pokemon_items_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

        embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
        agent_pokemon_genders_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
        embeddings.append(agent_pokemon_genders_embedding)
        embeddings_shape.append(Reshape(target_shape=(embedding_size,)))


        # 4 attack slots
        for j in range(4):
            embedding_size = POKEMON_LARGE_EMBEDDINGS_DIM
            agent_attack_slot_1_embedding = Embedding(POKEMON_MAX_VOCAB_SIZE, embedding_size, input_length=1 )
            embeddings.append(agent_attack_slot_1_embedding)
            embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

            embedding_size = POKEMON_SMALL_EMBEDDINGS_DIM
            agent_attack_slot_1_element_embedding = Embedding(POKEMON_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
            embeddings.append(agent_attack_slot_1_element_embedding)
            embeddings_shape.append(Reshape(target_shape=(embedding_size,)))

            embedding_size = 1
            agent_attack_slot_1_category_embedding = Embedding(POKEMON_EXTRA_SMALL_VOCAB_SIZE, embedding_size, input_length=1 )
            embeddings.append(agent_attack_slot_1_category_embedding)
            embeddings_shape.append(Reshape(target_shape=(embedding_size,)))




    merged = Concatenate(axis=-1)#(embeddings)


    self.conv1_1 = Conv1D(256, 10, activation='relu')
#    conv1 = Conv1D(100, 10, activation='relu', batch_input_shape=(None, ob_space.shape[1]))(field_inputs_)
    self.conv1_2 = Conv1D(256, 10, activation='relu')
    self.max_1 = MaxPooling1D(8)
    self.conv1_3 = Conv1D(128, 4, activation='relu')
    self.conv1_4 = Conv1D(128, 4, activation='relu')
    self.max_2 = MaxPooling1D(8)
    self.conv1_5 = Conv1D(256, 10, activation='relu')
    self.conv1_6 = Conv1D(256, 10, activation='relu')
    self.glob_1 = GlobalAveragePooling1D()
    self.drop = Dropout(0.3)


    # This returns a tensor
    non_category_data_input_keras = tf.keras.layers.Input( POKEMON_FIELD_REMAINDER, name="non_category_data_input")
    categorical_dense = tf.keras.layers.Dense(512, activation='relu')#(merged)
#    categorical_dense = Reshape(target_shape=(512,))(categorical_dense)
    non_categorical_dense_1 = tf.keras.layers.Dense(512, activation='relu')#(non_category_data_input_keras)
    non_categorical_dense_2 = tf.keras.layers.Dense(1024, activation='relu')#(non_category_data_input_keras)
    non_categorical_dense_3 = tf.keras.layers.Dense(512, activation='relu')#(non_category_data_input_keras)

    combined_fields = Concatenate(axis=-1)#([non_categorical_dense, categorical_dense])

    self.combined_dense_1 = tf.keras.layers.Dense(256, activation='relu')
    self.combined_dense_2 = tf.keras.layers.Dense(512, activation='relu')
    self.combined_dense_3 = tf.keras.layers.Dense(256, activation='relu')

    self.embeddings = embeddings
    self.embeddings_shape = embeddings_shape
    self.merged = merged
    self.categorical_dense = categorical_dense
    self.non_categorical_dense_1 = non_categorical_dense_1
    self.non_categorical_dense_2 = non_categorical_dense_2
    self.non_categorical_dense_3 = non_categorical_dense_3
    self.non_category_data_input_keras = non_category_data_input_keras
    self.combined_fields = combined_fields

    # Note: no tf.get_variable(), just simple Keras API!
    self.hidden1 = kl.Dense(256, activation='relu')#(combined_fields)
    self.hidden2 = kl.Dense(128, activation='relu')
    self.value = kl.Dense(1, name='value')
    # Logits are unnormalized log probabilities.
    self.logits = kl.Dense(num_actions, name='policy_logits')
    self.dist = ProbabilityDistribution()

  def call(self, inputs, **kwargs):
    embedding_size = POKEMON_EXTRA_SMALL_EMBEDDINGS_DIM
    # Inputs is a numpy array, convert to a tensor.


    reshaped_embeddings = []
    categorical_length = len(self.embeddings)
    for i in range(categorical_length):
        cat_slice = tf.slice(inputs, [0, i], [-1, 1])
        reshaped_embeddings.append(self.embeddings_shape[i](self.embeddings[i](cat_slice)))


    #reshaped_embeddings.append(self.embeddings_shape[1](self.embeddings[0](b)))
    #reshaped_embeddings.append(self.embeddings_shape[2](self.embeddings[0](c)))
    non_categorical = tf.slice(inputs, [0, categorical_length], [-1, -1])

#    embeddings = []
#    embeddings.append(self.embeddings[0](a))
#    embeddings.append(self.embeddings[0](b))
#    embeddings.append(self.embeddings[0](c))
#    print('embeddings', embeddings)

    x = self.merged(reshaped_embeddings)

    # Expand dims for conv1d
    combined_fields = K.expand_dims(x, 2)


#    self.conv1_1 = Conv1D(100, 10, activation='relu', batch_input_shape=(None, combined_fields.get_shape()[1]))(combined_fields)
#    conv1 = Conv1D(100, 10, activation='relu', batch_input_shape=(None, ob_space.shape[1]))(field_inputs_)
    conv = self.conv1_1(combined_fields)
    conv = self.conv1_2(conv)
    conv = self.max_1(conv)
    conv = self.conv1_3(conv)
    conv = self.conv1_4(conv)
    conv = self.max_2(conv)
    conv = self.conv1_5(conv)
    conv = self.conv1_6(conv)
    conv = self.glob_1(conv)
    conv = self.drop(conv)

    x = self.categorical_dense(conv)
    y = self.non_categorical_dense_1(non_categorical)
    y = self.non_categorical_dense_2(y)
    y = self.non_categorical_dense_3(y)

    z = self.combined_fields([x, y])

    z = self.combined_dense_1(z)
    z = self.combined_dense_2(z)
    z = self.combined_dense_3(z)
    hidden_logs = self.hidden1(z)

    hidden_vals = self.hidden2(z)

    returnlogs = self.logits(hidden_logs)

    returnvals = self.value(hidden_vals)

    return returnlogs, returnvals

  def action_value(self, obs, valid_moves):
    # Executes `call()` under the hood.
#    print('quack 1')
    logits, value = self.predict_on_batch(obs)
#    print('quack 2')
    zero = tf.constant(0, dtype=tf.float64)
    zero_where = tf.not_equal(valid_moves, zero)
    indices = tf.where(zero_where)

    new_logits = [tf.gather(logits[0], tf.squeeze(indices))]
    # if only 1 move available, prevent tensor scalar from being used
    # by converting back to list with 1 element
    new_logits = [tf.reshape(new_logits[0], [-1])]

    raw_action = tf.squeeze(tf.random.categorical(new_logits, 1), axis=-1)

    # Another way to sample actions:
    #   action = tf.random.categorical(logits, 1)
    # Will become clearer later why we don't use it.
#    print('quack 3')

    original_raw = raw_action
    true_action = -1
    for i in range(len(valid_moves)):
        valid_move_index = i

        if valid_moves[valid_move_index] == 1:
            raw_action -= 1

        if raw_action == -1:
            true_action = valid_move_index
            break

    return np.asarray(true_action), np.squeeze(value, axis=-1)
