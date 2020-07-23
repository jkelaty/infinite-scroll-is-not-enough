from random            import randrange
from datetime          import datetime
from requests_oauthlib import OAuth1
from credentials       import TWITTER_CREDENTIALS, GPT_2_CREDENTIALS

import requests


# Retrives user data from twitter API
def getUserData(user):
    AUTH = OAuth1(TWITTER_CREDENTIALS['API_KEY'], TWITTER_CREDENTIALS['API_SECRET'])
    return requests.get('https://api.twitter.com/1.1/users/show.json?tweet_mode=extended&screen_name=' + user, auth=AUTH).json()


# Retreives tweet data
def getTweetData(tweet_id):
    AUTH = OAuth1(TWITTER_CREDENTIALS['API_KEY'], TWITTER_CREDENTIALS['API_SECRET'])
    return requests.get('https://api.twitter.com/1.1/statuses/show.json?tweet_mode=extended&id=' + tweet_id, auth=AUTH).json()


# Retrieves some numbers of tweets from a user's timeline
def getPrompts(user):
    AUTH = OAuth1(TWITTER_CREDENTIALS['API_KEY'], TWITTER_CREDENTIALS['API_SECRET'])
    result = requests.get('https://api.twitter.com/1.1/statuses/user_timeline.json?tweet_mode=extended&screen_name=' + user + '&exclude_replies=1&include_rts=0', auth=AUTH).json()
    tweets = list()

    # Error handling (invalid user, API error, etc..) or no tweets on timeline
    if 'errors' in result or 'error' in result or len(result) == 0:
        return tweets

    # Changed to 1 because tweet generation can take up to 30
    # seconds, at which point Heroku breaks the connection
    for _ in range(1):
        index = randrange(len(result))
        new_text = list(result[index]['full_text'])
        
        # Remove special entities in text (URLs, mentions, hashtags, symbols)
        # TODO: Maybe reconsider to only remove URLs?
        for entity in result[index]['entities']:
            for entry in result[index]['entities'][entity]:
                for i in range(int(entry['indices'][0]), int(entry['indices'][1])):
                   new_text[i] = '\0'
        
        result[index]['full_text'] = ''.join(new_text).replace('\0', '')
        tweets.append(result[index]) # Selects random tweet from list and appends to our list of prompts

    return tweets


# Calls InferKit's GPT-2 API to generate a tweet from a prompt
def generateTweet(prompt):
    # POST request body
    body = {
        'prompt': {
            'text': prompt,
            'isContinuation': False
        },
        'startFromBeginning': True,
        'length': 140 # Tweet length
    }

    # POST request headers (API credentials)
    headers = {
        'Authorization': 'Bearer ' + GPT_2_CREDENTIALS['TOKEN']
    }

    result = requests.post('https://api.inferkit.com/v1/models/standard/generate', json=body, headers=headers).json()

    if 'data' in result and 'text' in result['data'] and len(result['data']['text']) > 0:
        return result['data']['text'][1:] # Ignore first character which is always a space (because we use a prompt)
    else:
        return ''

