from requests_oauthlib import OAuth1
from random            import randrange
from credentials       import TWITTER_CREDENTIALS, GPT_2_CREDENTIALS

import requests

def getTwitterData(user):
    AUTH = OAuth1(TWITTER_CREDENTIALS['API_KEY'], TWITTER_CREDENTIALS['API_SECRET'])
    return requests.get('https://api.twitter.com/1.1/users/show.json?screen_name=' + user, auth=AUTH).json()


def getPrompts(user):
    AUTH = OAuth1(TWITTER_CREDENTIALS['API_KEY'], TWITTER_CREDENTIALS['API_SECRET'])
    result = requests.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=' + user + '&exclude_replies=1&include_rts=0', auth=AUTH).json()
    tweets = list()

    if 'errors' in result or 'error' in result or len(result) == 0:
        return tweets

    for _ in range(1):
        tweets.append(result[randrange(len(result))]['text'])

    return tweets


def generateTweet(prompt):
    body = {
        'prompt': {
            'text': prompt,
            'isContinuation': False
        },
        'startFromBeginning': True,
        'length': 140
    }
    headers = {
        'Authorization': 'Bearer ' + GPT_2_CREDENTIALS['TOKEN']
    }

    result = requests.post('https://api.inferkit.com/v1/models/standard/generate', json=body, headers=headers).json()

    if 'data' in result and 'text' in result['data'] and len(result['data']['text']) > 0:
        return result['data']['text'][1:]
    else:
        return ''

