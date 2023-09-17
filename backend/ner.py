import numpy as np
import torch
from transformers import BertForTokenClassification, BertTokenizer

tag_values = ['B-art','B-per','B-eve','I-gpe','I-geo','B-geo','I-art','I-per','B-gpe','B-nat','I-eve','I-nat','I-tim','B-org','O','B-tim','I-org','PAD']
tag2idx = {t: i for i, t in enumerate(tag_values)}
tokenizer = BertTokenizer.from_pretrained('bert-base-cased', do_lower_case=False)
model = BertForTokenClassification.from_pretrained(
    "bert-base-cased",
    num_labels=len(tag2idx),
    output_attentions=False,
    output_hidden_states=False
)
model.load_state_dict(torch.load('model_checkpoint.pth'))
model.cuda()

def ner_analyze(test_sentence):
    dict = {}
    dict['geo'] = []
    dict['org'] = []
    dict['per'] = []
    dict['gpe'] = []
    dict['tim'] = []
    tokenized_sentence = tokenizer.encode(test_sentence)
    input_ids = torch.tensor([tokenized_sentence]).cuda()
    with torch.no_grad():
        output = model(input_ids)
    label_indices = np.argmax(output[0].to('cpu').numpy(), axis=2)
    tokens = tokenizer.convert_ids_to_tokens(input_ids.to('cpu').numpy()[0])
    new_tokens, new_labels = [], []
    for token, label_idx in zip(tokens, label_indices[0]):
        if token.startswith("##"):
            new_tokens[-1] = new_tokens[-1] + token[2:]
        else:
            new_labels.append(tag_values[label_idx])
            new_tokens.append(token)
    for i in range(len(new_labels)):
        label = new_labels[i]
        token = new_tokens[i]
        if token.startswith('['):
            new_labels[i] = 'O'
        elif label.startswith('B'):
            type = label[2:]
            if type in dict:
                dict[type].append(token)
        elif label.startswith('I'):
            try:
                Itype = new_labels[i][2:]
                Btype = new_labels[i-1][2:]
                if Itype in dict:
                    if Itype==Btype:
                        dict[Itype][-1] += "(.*?)"+token
                    else:
                        dict[Itype].append(token)
            except:
                for token, label in zip(new_tokens, new_labels):
                    print("{}\t{}".format(label, token))
    return dict
