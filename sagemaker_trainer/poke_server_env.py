U
    �4`� �                $   @   s�  d dl Z d dlZ d dlmZ d dlZd dlZd dlZd dlZd dlZd dl	Z	d dl
Z
d dlZd dlZd dlZd dlZd dlZd dlZd dlZeeej�dd ���Zeeej�dd ���ZdZdZdZdZd	Zd
ZdZej�dd�Z ej�dd�Z!ddddddddddddddddd gZ"dddddddddddddgZ"dddddddddg	Z#G d!d"� d"ej$�Z%G d#d$� d$ej$�Z&e%j'e%j(e%j)gZ*G d%d&� d&ej$�Z+G d'd(� d(ej$�Z,G d)d*� d*ej$�Z-e,j.e,j/e,j0e,j1e,j2e,j3e,j4e,j5e,j6e,j7e,j8e,j9e,j:e,j;e,j<e,j=e,j>e,j?e,j@e,jAfZBe,j2e,j3e,j4e,j5gZCe,j6e,j7e,j8e,j9gZDe,j:e,j;e,j<e,j=gZEe,j>e,j?e,j@e,jAgZFe,jGe,jHe,jIe,jJe,jKe,jLfZMe-jNe-jOe-jPe-jQgZRd+d,d-d.gZSd/d0� ZTd1d2� ZUG d3d4� d4�ZVG d5d6� d6�ZWG d7d8� d8e jX�ZYd9d:d;d<d9d<d=d>d=d=d?d?d@d<d=dAdBdBdAdCd=dAd:dDd=dBdEdFd=dAdGdAd=d=d<dH�#ZZeZZ[ej�dIe�\eZ��Z]e^e]�_� �d k�rRe�`e]�Z[d ZNdJZOd?ZPdKZQeOeOgZadJZ'd?Z(dLZ)G dMdN� dNe jX�ZbdS )O�    N)�seeding�DISPLAY_EVERYTHING�ALWAYS_SHOW_SUMMARYz\|request\|{"forceSwitch":\[z\|request\|{"wait":truez\|observation\|{"z\|encoders\|{"z\|turn\|\d*uL   \|error\|\[Unavailable choice\] Can't switch: The active Pokémon is trappeduH   \|error\|\[Invalid choice\] Can't switch: The active Pokémon is trapped�
SERVER_URLzhttp://localhost:9874/api/�MODEL_SERVER_URLzhttp://localhost:8000/api/Zgen8uberZgen8ouZgen8uublZgen8uuZgen8rublZgen8ruZgen8nublZgen8nuZgen8publZgen8puZgen8zuZgen8nfeZgen8lcZgen8capZ	gen8caplcZ
gen8capnfeZgen8agc                   @   s$   e Zd ZdZdZdZdZdd� ZdS )�GameType�   �   �   �   c                 C   s4   | t jt jfkrdS | t jkr"dS | t jkr0dS d S )NZsinglesZdoubles�triples)r   �SINGLES�EXPERIMENTAL_SINGLES�DOUBLES�TRIPLES��self� r   �poke_server_env.py�name7   s    

zGameType.nameN)�__name__�
__module__�__qualname__r   r   r   r   r   r   r   r   r   r   1   s
   r   c                   @   s,   e Zd ZdZdZdZdZdZdZdZ	dZ
d	S )
�GENr   r	   r
   r   �   �   �   �   N)r   r   r   ZONEZTWOZTHREEZFOURZFIVEZSIXZSEVEN�EIGHTr   r   r   r   r   ?   s   r   c                   @   s4   e Zd ZdZdZdZdZdZdZdZ	dZ
d	d
� ZdS )�SELECTABLE_TARGETr   r   r	   r
   r   r   r   r   c                 C   s�   | t jkrdS | t jkr(|dkr$dS dS | t jkr6dS | t jkrDdS | t jkrRdS | t jkr`dS | t jkrndS | t jkr|dS d S )	N� �az-1z-2z-3z+1z+2z+3)	r   �DO_NOT_SPECIFY�SELF�ALLY_SLOT_1�ALLY_SLOT_2�ALLY_SLOT_3�
FOE_SLOT_1�
FOE_SLOT_2�
FOE_SLOT_3)r   �positionr   r   r   �get_target_indexU   s$    







z"SELECTABLE_TARGET.get_target_indexN)r   r   r   r"   r#   r'   r$   r(   r%   r)   r&   r+   r   r   r   r   r   K   s   r   c                   @   s�   e Zd ZdZdZdZdZdZdZdZ	dZ
d	Zd
ZdZdZdZdZdZdZdZdZdZdZdZdZdZdZdZdZdZdZdZdd� Z d d!� Z!d"d#� Z"d,d%d&�Z#d'd(� Z$d)d*� Z%d+S )-�Actionr   r   r	   r
   r   r   r   r   r   �	   �
   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   �   c                 C   s   dS )Nr   r   r   r   r   r   �get_base_weight�   s    zAction.get_base_weightc                 C   s   | t krdS | tkrdS dS )N�333333�?皙�����?皙�����?��ATTACK_ACTIONS�SWITCH_ACTIONSr   r   r   r   �get_attack_priority_weight�   s
    z!Action.get_attack_priority_weightc                 C   s   | t krdS | tkrdS dS )NrB   �{�G�z�?rD   rE   r   r   r   r   �get_till_last_breath_weight�   s
    z"Action.get_till_last_breath_weightFc                 C   sT   | � � | �� | �� g}|dks&|dkr8tj�|d�d S | tkrDdS | tkrPdS dS )NFr   r   rC   皙�����?rD   )rA   rJ   rH   �np�random�choicerF   rG   )r   Zis_weak_to_stabZunder_45_percentZother_optionsr   r   r   �get_strategic_withdrawl_weight�   s    z%Action.get_strategic_withdrawl_weightc                 C   s�   | t jkrdS | t jkrdS | t jkr*dS | t jkr8dS | t jkrFdS | t jkrTdS | t jkrbdS | t jkrpdS | t j	kr~d	S | t j
kr�d
S | t jkr�dS | t jkr�dS | t jkr�dS | t jkr�dS d S �Nz!attack1z!attack2z!attack3z!attack4z!dyna1z!dyna2z!dyna3z!dyna4z!switch1z!switch2z!switch3z!switch4z!switch5z!switch6�r,   �Attack_Slot_1�Attack_Slot_2�Attack_Slot_3�Attack_Slot_4�Attack_Dyna_Slot_1�Attack_Dyna_Slot_2�Attack_Dyna_Slot_3�Attack_Dyna_Slot_4�Change_Slot_1�Change_Slot_2�Change_Slot_3�Change_Slot_4�Change_Slot_5�Change_Slot_6r   r   r   r   �get_twitch_commands�   s8    













zAction.get_twitch_commandsc                 C   s�   | dkrt jS | dkrt jS | dkr*t jS | dkr8t jS | dkrFt jS | dkrTt jS | dkrbt jS | dkrpt jS | d	kr~t j	S | d
kr�t j
S | dkr�t jS | dkr�t jS | dkr�t jS | dkr�t jS d S rP   rQ   )Zcommandr   r   r   �get_action_for_twitch_commands�   s8    z%Action.get_action_for_twitch_commandsN)FF)&r   r   r   rR   rS   rT   rU   rZ   r[   r\   r]   r^   r_   �Attack_Mega_Slot_1�Attack_Mega_Slot_2�Attack_Mega_Slot_3�Attack_Mega_Slot_4�Attack_ZMove_Slot_1�Attack_ZMove_Slot_2�Attack_ZMove_Slot_3�Attack_ZMove_Slot_4�Attack_Ultra_Slot_1�Attack_Ultra_Slot_2�Attack_Ultra_Slot_3�Attack_Ultra_Slot_4rV   rW   rX   rY   �
SHIFT_LEFT�Not_Decided�PassrA   rH   rJ   rO   r`   ra   r   r   r   r   r,   r   sF   
 r,   c                   @   s   e Zd ZdZdZdZdZdS )�RANDOM_STYLESr   r   r	   r
   N)r   r   r   �NORMAL_RANDOM�PRIORITY_ATTACK�TIL_LAST_BREATH�STRATEGIC_WITHDRAWALr   r   r   r   rq   �   s   rq   rB   rK   g�������?rC   c                 C   s�  | dk r<|dkr<t jt jt jt jt jt jt jt jt j	t j
g
S | dkr�|dkr�| dkr�t jt jt jt jt jt jt jt jt j	t j
t jgS | dkr�t jt jt jt jt jt jt jt jt j	t j
t jt jt jt jt jgS | dk�rt jt jt jt jt jt jt jt jt j	t j
t jt jt jt jgS | dk�rxt jt jt jt jt jt jt jt jt j	t j
t jt jt jt jt jt jt jt jt jt jt jt jgS | dk�r�t jt jt jt jt jt jt jt jt j	t j
t jt jt jt jgS t jt jt jt jt jt jt jt jt j	t j
g
S )Nr   r   )r   r   r   r   r   )r,   rR   rS   rT   rU   rZ   r[   r\   r]   r^   r_   rn   rb   rc   rd   re   rf   rg   rh   ri   rj   rk   rl   rm   rV   rW   rX   rY   )�gen�gametyper   r   r   �get_actions_for_gen  s�            �        �           �
           �
                 �
           �        �rx   c                 C   s&  |}|d kr,t t�}t�d|d �}t|�}d}|tjkr>d}|tjkrLd}|tjkrZd}|tjkrhd}|tjkrvd}|tj	kr�d}|tj
kr�d	}|tjkr�d
}|tjkr�d}|tjkr�d}|tjkr�d}|tjkr�d}|tjkr�d}|tjkr�d}|tjk�rd}d| |f }|�s|S d||f S )Nr   r	   zmove 1zmove 2zmove 3zmove 4zmove 1 dynamaxzmove 2 dynamaxzmove 3 dynamaxzmove 4 dynamaxzswitch 1zswitch 2zswitch 3zswitch 4zswitch 5zswitch 6�passz>%s %s�%s %s)�lenr,   rM   ZrandintrR   rS   rT   rU   rV   rW   rX   rY   rZ   r[   r\   r]   r^   r_   rp   )�player�actionZtarget_text�
is_doublesZactionsZaction_text�messager   r   r   �%get_action_text_for_action_and_target?  sP    













r�   c                   @   s    e Zd Zdd� Zedd� �ZdS )�ActionRequestc                 C   s4   t jt jt jd�| _tjtjtjd�| _tj| _d S )N�r!   �b�c)r,   ro   �active_pokemon_actionsr   r"   �active_pokemon_targetsr$   �action_for_positionr   r   r   r   �__init__q  s    zActionRequest.__init__c                  C   s:   g } | � d� | � d� | � d� | � d� | � d� | S )NZactive_pokemon_actions_aZactive_pokemon_targets_aZactive_pokemon_actions_bZactive_pokemon_targets_br�   )�append)Zcategory_encode_labelsr   r   r   �get_raw_verify_labelsw  s    




z#ActionRequest.get_raw_verify_labelsN)r   r   r   r�   �staticmethodr�   r   r   r   r   r�   p  s   r�   c                       s  e Zd Zejf� fdd�	Zdd� Zdd� Zdd� Zd	d
� Z	dd� Z
d>dd�Zdd� Zdd� Zdd� Zedd� �Zd?dd�Zdd� Zdd� Zdd� Zd d!� Zd"d#� Zd$d%� Zd&d'� Zd(d)� Zd*d+� Zd,d-� Zd.d/� Zd0d1� Zd2d3� Zd4d5� Zd6d7� Z d@d:d;�Z!dAd<d=�Z"�  Z#S )B�EnvironStatec                    sB   t � ��  tj| _| ��  d | _d| _d| _t	| _
t| _g | _d S )NTF)�superr�   rq   rs   �random_style�clear_everything�simulater~   Z
is_triples�DEFAULT_REWARD_CONFIG�reward_configr   �display_everythingZrewards)r   r�   ��	__class__r   r   r�   �  s    
zEnvironState.__init__c                 C   s�  d| _ d| _g | _g | _g | _g | _g | _g | _g | _g | _	g | _
g | _g g g d�| _g g g d�| _g g g d�| _g g g d�| _i | _i | _d| _t� | _t� | _tt�� �| _d| _d| _d| _d| _d| _d| _g | _ g | _!t"j#| _$t%j&| _'| j'| _(d| _)g | _*d| _+dddd�| _,dddd�| _-d| _.d| _/d| _0g | _1i | _2d | _3d | _4d | _ d | _!d | _5d | _6d | _7d | _8d| _9d| _:d S )Nr   r�   Tr    ZUbersF);�turns�steps�p1_kifu�p2_kifu�p1_raw_kifu�p2_raw_kifu�p1_raw_labels�p2_raw_labels�p1_raw_observations�p2_raw_observations�p1_observations�p2_observations�p1_valid_moves�p2_valid_moves�p1_target_moves�p2_target_moves�p1_observationsSet�p2_observationsSet�p2_is_randomr�   �p1_action_request�p2_action_request�str�uuid�uuid4�	step_uuid�p1_transcript�p2_transcript�	p1_reward�	p2_reward�p1_kifu_transcript�p2_kifu_transcript�p1_rewards_tracker�p2_rewards_trackerr   r   rv   r   r   rw   �gametype_to_useZtier�transcripto�should_self_print�p1_open_request�p2_open_request�p1_is_waiting�p2_is_waitingr�   �request_outputsZteam_pokemon_metrics�twitch_pending_summary�twitch_pending_battle_summary�match_summary�field_summary�
p1_summary�
p2_summary�categories_length�
obs_lengthr   r   r   r   r�   �  sj    zEnvironState.clear_everythingc                 C   s�   d| j | j| j| j| jf }d| j| j| j| j| j	f }d| j
| j| j| j| j| jf }d| j| j| j| j| j| jf }t|� t|� t|� t|� td| j� td| j� d S )NzSP1 shields: safeguard: %r, lightscreen: %r, reflect: %r, tailwind: %r, auraviel: %rzSP2 shields: safeguard: %r, lightscreen: %r, reflect: %r, tailwind: %r, auraviel: %rzdP1 imports: used_z_move: %r, used_mega: %r, has_rocks: %r, has_web: %r, spikes: %d, toxic_spikes: %dzdP2 imports: used_z_move: %r, used_mega: %r, has_rocks: %r, has_web: %r, spikes: %d, toxic_spikes: %dz
p1 trappedz
p2 trapped)Zp1_safeguardZp1_lightscreenZ
p1_reflectZp1_tailwindZp1_aurora_veilZp2_safeguardZp2_lightscreenZ
p2_reflectZp2_tailwindZp2_aurora_veilZp1_used_zmoveZp1_used_megaZp1_has_rocksZ
p1_has_webZ	p1_spikesZp1_toxic_spikesZp2_used_zmoveZp2_used_megaZp2_has_rocksZ
p2_has_webZ	p2_spikesZp2_toxic_spikes�printZ
p1_trappedZ
p2_trapped)r   Zp1_shield_messageZp2_shield_messageZp1_import_messageZp2_import_messager   r   r   �summary_printout�  s      zEnvironState.summary_printoutc                 C   sJ   |� � }|dks| jdkrd S d}d}|�dd�}|�dd�}t|� d S )Nr    FZ_p_Z_a_�_p1_�_p2_�	Opposing )�stripr�   �replacer�   �r   r   Zplayer_regexZagent_regexr   r   r   �printo_magnet�  s    zEnvironState.printo_magnetc                 C   s�   |� � }|dkrd S d}d}d| j|f | _| j�dd�| _| j�dd�| _d| j|f | _| j�dd�| _| j�dd�| _d S )Nr    r�   r�   z%s
%sr�   )r�   r�   r�   r�   r�   r   r   r   �append_to_transcript�  s    z!EnvironState.append_to_transcriptc                 C   s   | j �|� d S �N)r�   �update)r   r�   r   r   r   �apply_reward_config   s    z EnvironState.apply_reward_configFc                 C   s�  | � �  || _|| _|| _|| _| jd krX| jj��  | jj��  | jj	��  | j�
�  tjdddgtjtjtjddd�}|| _| jtjtjfkr�| jtjkr�| jj�d� n| jj�d� | jj�d	t�t� � | jj�d
� | jj�d� n�| jtjk�rttj�tt��}t| }| jj�d| � |tk�rP| jj�d� | jj�d� | jj�d	t�t� � td| � g | _g | _| ��  d S )NZnodez#./pokemon-showdown/pokemon-showdownzsimulate-battleTr   )�stdin�stdout�stderrZuniversal_newlines�bufsizez'>start {"formatid":"gen8randombattle"}
z.>start {"formatid":"gen8randomdoublesbattle"}
z>reward %s
z>player p1 {"name":"Alice"}
z>player p2 {"name":"Bob"}
z>expstart {"formatid":"%s"}
z>p1 team 123456
z>p2 team 123456
zchosen format: %s) r�   r�   r�   r�   rw   r�   r�   �closer�   r�   �kill�
subprocess�Popen�PIPEr   r   r   �write�json�dumpsr�   r   rL   rM   rN   r{   �SUPPORTED_FORMATS�TEAM_PREVIEW_FORMATSr�   r�   r�   �process_til_turn_1)r   r�   rw   r�   Zshould_printr�   �idxZselected_formatr   r   r   �reset  sJ    

�
zEnvironState.resetc                 C   sD   t d� | jd kr@| jj��  | jj��  | jj��  | j��  d S )Nzclosing state)r�   r�   r�   r�   r�   r�   r�   r   r   r   r   r�   7  s    
zEnvironState.closec                 C   s6   d S t|| d��}|�|� |�d� W 5 Q R X d S )Nzstep_by_step%s.jsonz./stepy/r!   z

)r�   �os�path�exists�dirname�makedirs�openr�   )r   Zdata_to_write�metrics_filename�kifu_dir�outfile_metricsr   r   r   �write_step_team_dataA  s        
z!EnvironState.write_step_team_datac                 C   sv   dD ]l}| j | r| jr"| j| r| j|dd�\}}t| jj| jj�}t|| �}| �	||d� | �
|||d� qd S )N)r!   r�   F�r*   �is_p1_perspective)r�   r�   Zp2_must_switch�sample_actionsrx   rv   �valuerw   r,   �apply_action_decision�record_kifu)r   r*   �action_index�target_enum�valid_moves_for_genZp2_action_rawr   r   r   �stockpile_p2_decisionsN  s    z#EnvironState.stockpile_p2_decisionsc                 C   s   t | �� �fS r�   )r{   �encoder   r   r   r   �shapeZ  s    zEnvironState.shapec           	      C   s�   | � � dk}| �|�}|dkr"d}| j| }| j| }| j}| j}|rf| j| }| j| }| j}| j	}|| � � || j
| j| j| j| j| j| j| j| j| j| j| j
 ||d�}|S )z9
        Convert current state into numpy array.
        �p1Nr!   )�
transcriptr|   �combined�
cat_length�full_obs_lenr�   r�   r�   r�   r�   r�   �twitch_summary�twitch_battle_summary�
raw_length�valid_onehot_moves�valid_onehot_targets)�get_player_for_next_request� get_position_for_current_requestr�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   Zget_observation)	r   �includeTranscript�is_player_1�request_position�valid_moves�valid_targets�observationr�   Zresultsr   r   r   r�   a  s@    





�zEnvironState.encodec                 C   s�  | j r| ��  | �d� | �|||� | �|� | �� }d}d}d}d }d}	| �d| j � | �d| j � |s~|  jd7  _|�s |�s d}| j	j
�� �� }| j�|� | j�|� | �d| � d|kr�|  jd7  _|dk�r^| �� }
|
�r^| jd	 �s | jd
 �s | jd �r�q | jd	 �s>| jd
 �s>| jd �r^| j �r | ��  | �d� n�q |dk�rt| �� }d}d|�� k�r�t�|�}|d }d}	�q | j�r�| jd	 �s�| jd
 �s�| jd �r�| j �r d| _| ��  | �d� n�q d}q~| j�s| jd	 s~| jd
 s~| jd s~d}q~| ��  | jdk�r<| j �sH| jdk�rdtd� d}	d| _d| _d}| jd }|	�r�| jdk�r�| jd }|�r�| j|	|fS | j|	|fS d S )NFr    z$before main: self.p1_open_request:%sz$before main: self.p2_open_request:%sr   zfrom main:
%sz|turn|�
sideupdater!   r�   r�   r�   T�winner�P   �x   z Match taking too long������p2�
win_reward�   �quick_match_under_30_turns)r�   r�   �take_action_if_readyr�   �skip_update_sequencer�   r�   r�   r�   r�   r�   �readliner�   r�   r�   r�   r�   �process_sideupdate�process_updater�   �loadsr�   �!configure_action_request_positionr�   r�   r�   r�   )r   �action_enumr�   r  Zskip_update�outputZupdate_completeZturn_completer  �doneZp1_is_trappedZwinner_jsonr  r   r   r   �step�  s~    


$$

,& 

!zEnvironState.stepc                 C   sZ   d }d}|dkrV| j j�� �� }|�dd�}|dkr<| ��  t�t|�r|rt	|� qd S )NTz|turn|1�   ’�'r  )
r�   r�   r  r�   r�   r  �re�search�encoders_regexr�   )r   r  Zseeking_encodersr   r   r   r�   -  s    zEnvironState.process_til_turn_1c                 C   sZ   | j j�� �� }|�dd�}d}|dkrV| j j�� �� }|�dd�}t�t|�r d}q |S )Nr!  r"  Fr    T)r�   r�   r  r�   r�   r#  r$  �update_complete_regex)r   r  Zupdate_finishedr   r   r   r  C  s    zEnvironState.process_updatec                 C   s0  | j j�� ��  }}| j j�� �� }|�dd�}| j�|� | j�|� | j�|� | j�|� t�	t
|�r�d|kr|d| _nd| _| �||� d S t�	t|��r&t�|�d�d �d }dd	d
g}d|kr�t|�D ]\}}|| j|| < q�n*d|k�rt|�D ]\}}|| j|| < q�| �||� d S t�	t|��rD| �||� d S t�	t|��s`t�	t|��r| j j�� �� }| j j�� �� }| j j�� �� }	| j j�� �� }
|
�dd�}
| �|	|
� | j j�� �� }| j j�� �� }| j j�� �� }	| j j�� �� }
|
�dd�}
| �|	|
� dS d| _d| _| �||� d S )Nr!  r"  r�   T�|r	   ZforceSwitchr!   r�   r�   r  F)r�   r�   r  r�   r�   r�   r�   r�   r#  r$  �
wait_regexr�   r�   �update_player_side�force_switch_regexr�   r  �split�	enumerater�   r�   �observation_regex�update_player_observation�trapped_regex_1�trapped_regex_2)r   r|   r  Zswitch_details�	positionsr�   ZswitchZ_emptyZ_sideupdateZ_playerZ_outputr   r   r   r  X  sX    

zEnvironState.process_sideupdatec                 C   s�   d| j j| j�� f }t�|�d�d �}|| }d|kr�|| _|d | _|d | _	|d | _
|d | _|d	 | _|d
 | _|d | _nL|| _|d | _|d | _|d | _|d | _|d	 | _|d
 | _|d | _|d | _|d | _t|d �| _d S )Nz%s_%sr'  r	   r�   r  r
  Zraw_observation�
raw_labelsr  r�   �rewardZcategoryLength)rv   r�   r�   r   r�   r  r+  r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   �raw_kifu_labelsr�   r{   r�   )r   r|   r  Zmain_keyZall_observations_jsonZobservation_jsonr   r   r   r.  �  s0    














	z&EnvironState.update_player_observationc           
      C   s�   |}t �|�d�d �}d|kr�|d }dddg}tt|��D ]V}|| }d|krt| j}	d| j|| < tj|	j	|< q>| j
}	d| j|| < tj|	j	|< q>d S )	Nr'  r	   Zactiver!   r�   r�   r�   T)r�   r  r+  �ranger{   r�   r�   r,   rp   r�   r�   r�   )
r   r|   r  Zplayer_details_strZplayer_details_jsonZattacks_jsonr1  �ir*   �action_requestr   r   r   r)  �  s    	
zEnvironState.update_player_sidec                 C   s�  | � |��r�d}| j}|s$| j}d}|r0d| _nd| _g }d}d}dD ]�}|j| tjkr\qF|j| }|j| }	t	|||	�
|�| jtjk�}
|dkr�|jd |jd kr�|jd tkr�d}|dkr�|jd |jd kr�|jd tkr�d}tj|j|< tj|j|< |�|
� qFt|�dk�r6|d	 �d
d��dd�|d	< t|�dk�r||d	 �d
d��dd�|d	< |d �d
d��dd�|d< t|�dk�r�d�|�}|�dd�}|�r�|�d�d }d| }| �dd|f � | j�|� | jj�|d � d S )Nr�   r  Fr�   r!   r�   Tr	   r   z>p1 r    z>p2 r
   r   �,z ,z%s,passrz   zmerged_commads: �
)�is_player_ready_for_actionr�   r�   r�   r�   r�   r,   ro   r�   r�   r+   rw   r   r   rG   r   r"   r�   r{   r�   �joinr+  r�   r�   r�   r�   r�   )r   r  r|   r7  Zattack_commandsZ&should_replace_second_switch_with_passZ%should_replace_third_switch_with_passr*   r}   �targetZcommand_textZmerged_commadsr   r   r   r  �  sV    

��
z!EnvironState.take_action_if_readyc                 C   s�   | j | }| j| }| j}| j}|sD| j| }| j| }| j}| j}t| j	j
| jj
�}	|	�|�}
|r�|| | jg |
g |j
g }| j�|� | j�|� n6|| | jg |
g |j
g }| j�|� | j�|� d S r�   )r�   r�   r�   r�   r�   r�   r�   r�   rx   rv   r�   rw   �indexr�   r�   r�   r�   r�   r�   r�   )r   r}   r<  r*   Zp1_perspectiver
  r  r  Zraw_obsr�   r�   Zkifu_obsr   r   r   r�   6  s$    




zEnvironState.record_kifuc                 C   s^   |r0| j d rdS | j d r dS | j d rZdS n*| jd r>dS | jd rLdS | jd rZdS d S )Nr!   r�   r�   �r�   r�   �r   r  r   r   r   r  Q  s    





z-EnvironState.get_position_for_current_requestc                 C   sT   | j s$| jd s$| jd s$| jd r(dS | jsL| jd sL| jd sL| jd rPdS dS )Nr!   r�   r�   r�   r  )r�   r�   r�   r�   r   r   r   r   r  c  s
    $$z(EnvironState.get_player_for_next_requestc                 C   s6   | � � }|dk}| j}tj}|s,| j}tj}||_d S )Nr�   )r  r�   r   r$   r�   r%   r�   )r   Zcurrent_player_strr  r7  Z	ally_slotr   r   r   r  k  s    z.EnvironState.configure_action_request_positionc                 C   sl   | j }| j}|s| j}| j}| �|�}|| rh| �||||� d||< ||j|< ||j|< | �|||� d S )NF)	r�   r�   r�   r�   r  r�   r�   r�   �cleanse_non_dup_actions)r   r  r�   r  r7  Zopen_requestr	  r   r   r   r�   x  s    


z"EnvironState.apply_action_decisionc           
      C   s�   | j tjtjfkrd S | j tjkr.|dkr.d S d}|dkr>d}td| j� td| j� | j| }|sn| j| }t| j	j
| j j
�}|�|�}|tkr�t|�dkr�d||< |tkr�tD ]}|�|�}	d||	< q�d S )Nr�   r�   zself.p1_valid_moveszself.p2_valid_movesr   r   )rw   r   r   r   r   r�   r�   r�   rx   rv   r�   r=  rG   �sum�DYNAMAX_ATTACK_ACTIONS)
r   r}   r*   r  Zfuture_positionr
  r�   r=  Zdyna_actionZ
dyna_indexr   r   r   r@  �  s*    



z$EnvironState.cleanse_non_dup_actionsc                 C   sZ   |r.| j s(| jd s(| jd s(| jd rVdS n(| jsR| jd sR| jd sR| jd rVdS dS )Nr!   r�   r�   FT)r�   r�   r�   r�   r?  r   r   r   r:  �  s    $$z'EnvironState.is_player_ready_for_actionc                 C   sH   | j d s| j d s| j d r"dS | jd s@| jd s@| jd rDdS dS )Nr!   r�   r�   TFr>  r   r   r   r   r  �  s
    z!EnvironState.skip_update_sequencer!   Tc                 C   s�   | j | }| j| }|s,| j| }| j| }t| jj| jj�}g }t|�D ]v\}}g }	|dkrJ|| }
t	|�dkr�t|| �D ]\}}|dkr~|	�
t|�� q~t	|	�dkr�tjg}	|�
|
|	f� qJ|S )Nr   r   )r�   r�   r�   r�   rx   rv   r�   rw   r,  r{   r�   r   r"   )r   r*   r�   r
  r  r�   Zvalid_moves_and_targets_enumsr�   Z
action_bitZtarget_enumsr  Z
target_bitr   r   r   �get_valid_moves_for_player�  s&    



z'EnvironState.get_valid_moves_for_playerc                 C   s�   | � ||�}dd� |D �}| jtjkr6dd� |D �}n| jtjkrPdd� |D �}t�|�t|� }| j}| j	}|s~| j
}| j}tjjt|�|d�}|| }|d }	tj�t|	��}|	| }
t| jj| jj�}|�|d �}||
fS )Nc                 S   s   g | ]\}}|� � �qS r   )rA   ��.0r}   �_r   r   r   �
<listcomp>�  s     z/EnvironState.sample_actions.<locals>.<listcomp>c                 S   s   g | ]\}}|� � �qS r   )rH   rD  r   r   r   rG  �  s     c                 S   s   g | ]\}}|� � �qS r   )rJ   rD  r   r   r   rG  �  s     ��pr   r   )rC  r�   rq   rs   rt   rL   �asarrayrA  r�   r�   r�   r�   rM   rN   r{   rx   rv   r�   rw   r=  )r   r*   r�   �actions_targetsZweightsr
  r  r�   Zaction_targetZall_targetsZselected_targetr�   r�   r   r   r   r�   �  s(    zEnvironState.sample_actions)F)F)r!   T)r!   T)$r   r   r   rq   rs   r�   r�   r�   r�   r�   r�   r�   r�   r�   r�   �propertyr�   r�   r   r�   r  r  r.  r)  r  r�   r  r  r  r�   r@  r:  r  rC  r�   �__classcell__r   r   r�   r   r�   �  s>   H
3


0 F0J	
r�   c                   @   s�   e Zd ZdZddgiZejdfdd�Zdd� Zd$d	d
�Z	dd� Z
dd� Zdd� Zdd� Zdd� Zdd� Zdd� Zd%dd�Zdd� Zdd� Zdd� Zd&d d!�Zd"d#� ZdS )'�
PokeSimEnvN�render.modes�humanFc                 C   st   || _ t| j �| _tjjtt�d d�| _tjj	ddd| jj
d ftjd�| _| ��  || _td|� td|� d S )	Nr	   ��nr   ��   r   �ZlowZhighr�   ZdtypeZstylezuse network)r�   r�   �_state�gym�spaces�Discreter{   r,   �action_space�Boxr�   rL   �float32�observation_space�seedZuse_network_model2r�   )r   r�   Zuse_network_modelr   r   r   r�   	  s    $
zPokeSimEnv.__init__c                 C   s�  d}t | jjj| jjj�}t|| �}t|�}|dk}| j�|�}	| jj|	|d�}
d}|
D ]*\}}||krZ|D ]}||krnd} qZqnqZ|�s|}|}| jj	|	|d�\}}t | jjj| jjj�}t|| �}t
d||f � t
d||f � t
d| jj|	|d�� d	}| j�|||�\}}}|| }| jjdd
�}|d |d |d |d |d |d |d |d |d |d |d |d |d |d |d |d�}|�r�| jj|d< | jdd� |d |||fS )Nr   r�   r�   FTz Tried using %s, using %s insteadz'Target Tried using %s, using %s insteadzp1 should availables: i�����r  r�   r  r  r|   r�   r�   r�   r�   r�   r�   r   r  r�   r�   r  �r�   r  r  r|   r�   r�   r�   r�   r�   r�   r   r  r�   r�   r  r  Zkifu)�upload_and_storer�   )rx   rU  rv   r�   rw   r,   r   r  rC  r�   r�   r   r�   r�   �handle_session_completed)r   �action_as_int�target_as_int�
player_strZ
neg_rewardr�   r  r�   r  r	  rK  Zselection_validZactZtargetsr<  Z
old_actionZ
old_targetr�   r3  r  r  �obs�infor   r   r   r     s^      �zPokeSimEnv.stepc                 C   sz   t � � }| �|| jj| jj� | �|| jj| jj| jj� d S | jD ]0}| j| dksD| j| dksD| j| g krDqDqDd S )Nr  r   )�time�write_kifu_to_filerU  r�   r�   �write_raw_kifu_to_filer4  r�   r�   �preprocess_metrics�write_metrics_to_file�prepare_metrics_for_db�post_metrics_to_dbZupload_session_files�tracking_metricsZMETRIC_USER_ID_KEYZMETRIC_SESSION_ID_KEYZMETRIC_UPLOAD_FILENAMES_KEY)r   r`  Zts�keyr   r   r   ra  [  s          
*z#PokeSimEnv.handle_session_completedc           	      C   s�   d|| j f }d|| j f }| �|� | �|� d}tj�tj�|��sZt�tj�|�� t�|�}|j	|| dd d� t�|�}|j	|| dd d� d S )Nzkifu_%.3f_p1_%s.csvzkifu_%.3f_p2_%s.csv�
/tmp/kifu/F)�headerr=  �
�
session_id�add_upload_filenamer�   r�   r�   r�   r�   �pdZ	DataFrameZto_csv)	r   �	timestampr�   r�   �p1_filename�p2_filenamer�   �p1_df�p2_dfr   r   r   rh  r  s    



zPokeSimEnv.write_kifu_to_filec           
      C   s�   d|| j f }d|| j f }| �|� | �|� d}tj�tj�|��sZt�tj�|�� tj||d�}|j	|| d d� tj||d�}	|	j	|| d d� d S )Nzraw_kifu_%.3f_p1_%s.csvzraw_kifu_%.3f_p2_%s.csvrp  )�columns)r=  rr  )
r   rv  r2  r�   r�   rw  rx  r�   ry  rz  r   r   r   ri  �  s    

z!PokeSimEnv.write_raw_kifu_to_filec              	   C   s�   d|| j f }d}tj�tj�|��s8t�tj�|�� | �|� t|| d��}tj	| j
|ddd� W 5 Q R X tj| j
dd�}d S )Nzsession_metrics_%.3f_p1_%s.jsonrp  �wTr   )�	sort_keys�indent)r}  )rs  r�   r�   r�   r�   r�   rt  r�   r�   �dumprn  r�   )r   rv  r�   r�   r�   Zmetric_datar   r   r   rk  �  s    
z PokeSimEnv.write_metrics_to_filec                 C   s   d S r�   r   )r   �filenamer   r   r   rt  �  s    zPokeSimEnv.add_upload_filenamec                 C   s�   dD ]F}g }d}| j | D ]$}|r(d}q|�|� |d k	rd}q|| j |< q| j D ](}t| j | t�rRt| j | �| j |< qRd S )N)Zp1_switch_trackerZp2_switch_trackerFT)rn  r�   �
isinstance�set�list)r   ro  Znew_listZelement_last_turn�itemr   r   r   rj  �  s    

zPokeSimEnv.preprocess_metricsc                 C   s�   | j D ]�}| j | }t|tjj�r�t|t�s�g }|D ]b}|}|d krFnF|tkrXt|�}n4|tkrjt	|�}n"|t
kr|t|�}n|tkr�t|�}|�|� q4|}|| j |< qd S r�   )rn  r�  �collections�abc�Sequencer�   Z	ITEMS_KEYZid_for_item_nameZSEEN_POKEMON_KEYZid_for_pokemon_nameZSEEN_ABILITIES_KEYZid_for_ability_nameZSEEN_ATTACKS_KEYZid_for_attack_namer�   )r   ro  r�  Z	new_itemsZsub_itemZsub_item_idr   r   r   rl  �  s&    




z!PokeSimEnv.prepare_metrics_for_dbc                 C   sN   t | jj�}td|� tdt�|�� tdt�| j�� t� �| j|d � d S )N�p1_team_for_registrationZteam_metricsZsession_metrics)	Zget_pokemon_team_as_jsonrU  Z
p1_pokemonr�   r�   r�   rn  Z	DBManagerZstore_game_session)r   r�  r   r   r   rm  �  s
    
zPokeSimEnv.post_metrics_to_dbc                 C   s  t jjtt�td�}t| | _|tjkr>t|�tkr>t|�| _t	j
}	|t	jkrbt	|�tkrbt	|�}	| j�| j|	|� | j�|� tt�� �| _|| _| jjdd�}
|
d |
d |
d |
d |
d |
d	 |
d
 |
d |
d |
d |
d |
d |
d |
d |
d d d�}|
d dd|fS )NrH  Tr^  r�   r  r  r|   r�   r�   r�   r�   r�   r�   r   r  r�   r�   r  r_  r�   g        F)rL   rM   rN   r{   �ALL_RANDOM_STYLES�ALL_RANDOM_WEIGHTSr�   rq   �_value2member_map_r   r   �ALL_GAME_TYPESrU  r�   r�   r�   r�   r�   rs  �user_idr�   )r   r�   r�  �group_label�session_labelr�   �desired_bot_style�desired_gametype_styler�   rw   re  rf  r   r   r   r�   �  s:    

  �zPokeSimEnv.resetc                 C   s   | j jS r�   �rU  Zstate_transcriptr   r   r   r   �get_current_transcript  s    z!PokeSimEnv.get_current_transcriptc                 C   s   | j jS r�   r�  r   r   r   r   r�    s    c                 C   s2   |dk}| j �|�}| j j||d�\}}||jfS )Nr�   r�   )rU  r  r�   r�   )r   rd  r  r	  r�   r<  r   r   r   r�     s    zPokeSimEnv.sample_actionsc                 C   s*   t �|�\| _}t �|d �d }||gS )Nr   l        )r   Z	np_randomZ	hash_seed)r   r]  Zseed1Zseed2r   r   r   r]    s    zPokeSimEnv.seedc                 C   s   t d� | j��  d S )Nzclosing env)r�   rU  r�   r   r   r   r   r�     s    zPokeSimEnv.close)F)NN)N)r   r   r   �NETWORK_MODEL�metadatarq   rr   r�   r   ra  rh  ri  rk  rt  rj  rl  rm  r�   r�  r�   r]  r�   r   r   r   r   rN  �  s$   

C

$
rN  �(   r=   r  r8   r.   �#   r	   �   r   r3   r0   �<   �!   i�  ��   )#Zattack_immuneZattack_missedZattack_resistedZattack_rewardZattack_supereffectiveZconfused_beginZconfused_endZcriticalZ
curestatusZ+damage_by_hazards_opponent_ability_or_itemsZdamage_by_own_itemZdestiny_bond_startZfaintedZhazards_and_safeguard_etc_startZhazards_removedZhealth_change_baseZillusion_brokenZitem_knockedoffedZminor_switchZ
pain_splitZpokemon_damagedZpokemon_healZterrain_weather_triggerr  Zreflect_tailwind_etc_endZstatus_startZswitch_penaltyZ!taking_too_long_penalty_100_turnsZtaunt_beginZ	taunt_endr  Zyawn_successZused_abilityZprotection_bonusZstat_modified�REWARD_CONFIGr   r
   r   c                   @   sz   e Zd ZdZddgiZedddeefdd�Zd	d
� Z	dd� Z
dd� Zi edfdd�Zddd�Zdd� Zdd� Zdd� ZdS )�PokeEnvNrO  rP  Zprime_13zPrime Field DevicezAC2 Model V1c                 C   sX   || _ || _|| _|| _tjjdd�| _tjjdddt	j
d�| _|| _|| _t� | _d S )Nr2   rQ  r   rS  )is  rT  )r�  r�  r�  �model_server_urlrV  rW  rX  rY  rZ  rL   r[  r\  r�   �bot_stategriesrN  �poke_sim_env)r   r�  r�  r�  r�  r�   r�  r   r   r   r�   n  s    zPokeEnv.__init__c                 C   s   | j | j| j| jd�S )N�r�  r�  r�  Zbot_idr�  r   r   r   r   �
get_paramsz  s
    �zPokeEnv.get_paramsc                 C   s    | � � }d}| �||�}|d S )NZget_last_user_sessionZdownload_url)r�  Zfire_request)r   �params�urlZraw_respr   r   r   �get_most_recent_session�  s    zPokeEnv.get_most_recent_sessionc                 C   s*   | j �|||�\}}}}t�|�|||fS r�   )r�  r   rL   rJ  )r   r}   r<  r|   re  r3  r  rf  r   r   r   r   �  s    zPokeEnv.stepTc           
   	   C   sT   t j�tt��}t| }| jj| j| j| j	| j
|||d�\}}}}	t �|�|||	fS )N)r�  r�  r�   )rL   rM   rN   r{   �AVAILABLE_AI_BOTSr�  r�   r�   r�  r�  r�  rJ  )
r   ZconfigZ	game_typeZrandom_opponentr�   Z	bot_stylere  r3  r  rf  r   r   r   r�   �  s    *zPokeEnv.resetr�   c                 C   s   | j �|�\}}||fS r�   )r�  r�   )r   r|   rb  rc  r   r   r   r�   �  s    zPokeEnv.sample_actionsc                 C   sB   | j | }tj|td�}td|� ddi}tj|||d�}|�� S )N)�clszurl:zcontent-typezapplication/json)�data�headers)r�  r�   r�   Z	NpEncoderr�   ZrequestsZpost)r   r�  r�  Z	data_jsonr�  Zresponser   r   r   �model_fire_request�  s    

zPokeEnv.model_fire_requestc                 C   s4   | � � }||d< ||d< ||d< d}| �||�d S )Nr
  re  r�   Zpredict_validr}   )r�  r�  )r   re  r
  r�   r�  r�  r   r   r   �model_get_action�  s    zPokeEnv.model_get_actionc                 C   s   |d S )NrI   r   )r   r3  r   r   r   r3  �  s    zPokeEnv.reward)r�   )r   r   r   r�  r�  r   r�  r�  r�   r�  r�  r   r   r�   r�   r�  r�  r3  r   r   r   r   r�  b  s   


	
		r�  )crV  Z
gym.spacesZ	gym.utilsr   �enumZnumpyrL   rM   Zmathr�   r�   Zpandasru  rg  r�  r�   r�   �copyr#  �bool�int�environ�getr   r   r*  r(  r-  r%  r&  r/  r0  r   r   r�   r�   �Enumr   r   r   r   r   r�  r   r,   rq   rR   rS   rT   rU   rV   rW   rX   rY   rb   rc   rd   re   rf   rg   rh   ri   rj   rk   rl   rm   rF   rB  ZMEGA_ATTACK_ACTIONSZZMOVE_ATTACK_ACTIONSZULTRA_ATTACK_ACTIONSrZ   r[   r\   r]   r^   r_   rG   rr   rs   rt   ru   r�  r�  rx   r�   r�   r�   ZEnvrN  r�   r�  r�   ZREWARD_CONFIG_STRr{   r�   r  r�  r�  r   r   r   r   �<module>   s<                  �            �
'             � �01         )�&
