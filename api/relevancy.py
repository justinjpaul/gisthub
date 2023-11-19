import os
import pickle
import math
import re
from collections import defaultdict
import numpy as np

import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

from um_gpt import read_file

def tokenize_with_lemmas(text):
    text = re.sub(r'[\*\~\_\[\]\(\)\'\"\#\+\-\!\`\>]', '', text)
    tokens = word_tokenize(text)
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens]

    return lemmatized_tokens

def filter_stop_and_less_impactful_words(tokens):
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [token for token in tokens if token.lower() not in stop_words and len(token) > 2]

    return filtered_tokens

def make_vector_space(stream):
    di = defaultdict(int)
    
    lemmatized_tokens = tokenize_with_lemmas(stream)
    for token in filter_stop_and_less_impactful_words(lemmatized_tokens):
        di[token] += 1
    
    return di
    
def expand_vector_space(di1, di2):
    # Combine unique keywords from both dictionaries
    all_keywords = set(di1.keys()) | set(di2.keys())

    # Create vectors for each dictionary
    v1 = np.array([di1.get(keyword, 0) for keyword in all_keywords])
    v2 = np.array([di2.get(keyword, 0) for keyword in all_keywords])
    
    return v1, v2

    
def vector_similarity(v1, v2, method='cosine'):
    if method == 'cosine':
        dot_product = np.dot(v1, v2)
        mag1 = np.linalg.norm(v1)
        mag2 = np.linalg.norm(v2)
        
        if mag1 == 0 or mag2 == 0:
            return 0
        
        return dot_product / (mag1 * mag2)

    if method == 'euclid':
        return np.linalg.norm(v1 - v2)
    
    raise Exception('invalid method specified')

def tf_idf_similarity(v1, v2):
    pass

# Takes in two streams of words (strings)
# Returns relevancy score betweeen [-1, 1]
def get_cosine_similarity(s1, s2):
    di1 = make_vector_space(s1)
    di2 = make_vector_space(s2)
    
    print([x for x in di1 if di1[x] > 10])
    print([x for x in di2 if di2[x] > 10])
    v1, v2 = expand_vector_space(di1, di2)
    
    return vector_similarity(v1, v2, 'cosine')


# looks for most positive (or most negative) correlation
# abs then normalize
# try log scale
def map_cosine_score(cosine_score):
    return int(10 * math.log((math.e ** 10 - 1)*abs(cosine_score) + 1))
    # return map_score(abs(cosine_score), 0, 1, 0, 100)


def map_score(num, old_min, old_max, new_min, new_max):
    return int((num - old_min) / (old_max - old_min) * (new_max - new_min) + new_min)

# maybe auto reject if new doc doesn't have a large number of the words
def auto_reject(di1, di2):
    pass


def main():
    f1 = 'eecs281_1.txt'
    f2 = 'node.txt'
    
    s1 = read_file(f1)
    s2 = read_file(f2)
    
    cosine_score = get_cosine_similarity(s1, s2)
    print(cosine_score)
    print(map_cosine_score(cosine_score))
    
    
if __name__ == '__main__':
    main()