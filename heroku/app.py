from flask           import Flask, request
from flask_cors      import CORS, cross_origin
from psycopg2.extras import RealDictCursor
from datetime        import date, datetime
from twitter         import getUserData, getTweetData, getPrompts, generateTweet

import os
import json
import math
import psycopg2


# Initialize connection to database
# Credentials handled through enviornment vars (managed on Heorku)
DATABASE_URL = os.environ['DATABASE_URL']
conn = psycopg2.connect(DATABASE_URL, sslmode='require')

# Init Flask app and cross origin headers
app = Flask(__name__)
CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'


# API route to register a tweet in the database
@app.route('/register/', methods=['POST'])
@cross_origin()
def register_tweet():
    data = request.json # POST request data

    # Ensure JSON data has necessary data
    if not('handle' in data and 'date' in data and 'tweet' in data and 'id' in data):
        return json.dumps(list())

    # Ensure data is non-empty strings
    if data['handle'] == '' or data['date'] == '' or data['tweet'] == '' or data['id'] == '':
        return json.dumps(list())

    # Creates cursor to database and inserts tweet data.
    # Return will be the tweet's unique ID which is
    # automatically created and returned by the execute statement.
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        INSERT INTO tweets
        (handle, date, tweet, tweet_id)
        VALUES(%s, %s, %s, %s)
        RETURNING id
        """, (data['handle'], data['date'], data['tweet'], data['id'],))
    res = cur.fetchall()
    cur.close()
    conn.commit() # Commit changes to database (since we inserted a new entry)

    return json.dumps(res)


# API route to like a given [registered] tweet
@app.route('/like/<tweet_id>', methods=['GET'])
@cross_origin()
def like_tweet(tweet_id):
    # Creates cursor to database and selects tweet's likes
    cur1 = conn.cursor(cursor_factory=RealDictCursor)
    cur1.execute("""
        SELECT likes
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res1 = cur1.fetchall()
    cur1.close()

    # Invalid tweet ID
    if len(res1) == 0:
        return json.dumps(res1)

    # Increment like count by 1
    cur2 = conn.cursor(cursor_factory=RealDictCursor)
    cur2.execute("""
        UPDATE tweets
        SET likes = %s
        WHERE id = %s
        """, (int(res1[0]['likes'] + 1), int(tweet_id),))
    cur2.close()
    conn.commit() # Commit changes to database (since we update an entry)

    # Retreive tweet again for most recent like count to return to frontend
    cur3 = conn.cursor(cursor_factory=RealDictCursor)
    cur3.execute("""
        SELECT likes
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res3 = cur3.fetchall()
    cur3.close()

    return json.dumps(res3)


# API route to unlike a given [registered] tweet
@app.route('/unlike/<tweet_id>', methods=['GET'])
@cross_origin()
def unlike_tweet(tweet_id):
    # Creates cursor to database and selects tweet's likes
    cur1 = conn.cursor(cursor_factory=RealDictCursor)
    cur1.execute("""
        SELECT likes
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res1 = cur1.fetchall()
    cur1.close()

    # Invalid tweet ID or like count is already 0
    if len(res1) == 0 or res1[0]['likes'] == 0:
        return json.dumps(res1)

    # Decrement like count by 1
    cur2 = conn.cursor(cursor_factory=RealDictCursor)
    cur2.execute("""
        UPDATE tweets
        SET likes = %s
        WHERE id = %s
        """, (int(res1[0]['likes'] - 1), int(tweet_id),))
    cur2.close()
    conn.commit() # Commit changes to database (since we update an entry)

    # Retreive tweet again for most recent like count to return to frontend
    cur3 = conn.cursor(cursor_factory=RealDictCursor)
    cur3.execute("""
        SELECT likes
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res3 = cur3.fetchall()
    cur3.close()

    return json.dumps(res3)


# Get a [registered] tweet from the database from its tweet ID
# Will also make an API call to the Twitter API for profile data
# including profile display name and profile image
@app.route('/tweet/<tweet_id>', methods=['GET'])
@cross_origin()
def get_tweet(tweet_id):
    # Create cursor to database and select tweet
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT *
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res = cur.fetchall()
    cur.close()

    for tweet in res:
        # Call Twitter API to get profile data
        user_data = getUserData(tweet['handle'])
        tweet_data = getTweetData(tweet['tweet_id'])

        # Error handling and inserting into return dict
        # for display name and profile image
        if 'name' in user_data:
            tweet['name'] = user_data['name']
        else:
            tweet['name'] = None

        if 'profile_image_url_https' in user_data:
            tweet['image'] = user_data['profile_image_url_https']
        else:
            tweet['image'] = None

        # Create Tweet reply (original prompt)
        tweet['reply'] = dict()

        tweet['reply']['image']  = tweet['image']
        tweet['reply']['name']   = tweet['name']
        tweet['reply']['handle'] = tweet['handle']

        if 'id_str' in tweet_data:
            tweet['reply']['id'] = tweet_data['id_str']
        else:
            tweet['reply']['id'] = None

        if 'created_at' in tweet_data:
            tweet['reply']['date'] = datetime.strftime(datetime.strptime(tweet_data['created_at'] ,'%a %b %d %H:%M:%S +0000 %Y'), '%b %e')
        else:
            tweet['reply']['date'] = None

        if 'full_text' in tweet_data:
            tweet['reply']['tweet'] = tweet_data['full_text']
        else:
            tweet['reply']['tweet'] = None

        if 'retweet_count' in tweet_data:
            tweet['reply']['retweets'] = tweet_data['retweet_count']
        else:
            tweet['reply']['retweets'] = None

        if 'favorite_count' in tweet_data:
            tweet['reply']['likes'] = tweet_data['favorite_count']
        else:
            tweet['reply']['likes'] = None

    return json.dumps(res)


# Get Twitter user data if valid user,
# else return as invalid search query
@app.route('/query/<user>', methods=['GET'])
@cross_origin()
def get_profile(user):
    data = getUserData(user)
    user_data = dict()

    if 'errors' in data or 'error' in data:
        user_data['type'] = 'search'
        user_data['query'] = user
    else:
        user_data['type'] = 'profile'
        user_data['query'] = user

        if 'name' in data:
            user_data['name'] = data['name']
        else:
            user_data['name'] = None

        if 'profile_image_url_https' in data:
            user_data['image'] = data['profile_image_url_https']
        else:
            user_data['image'] = None

    return json.dumps(user_data)


# Get homepage tweets by page number
@app.route('/home/<page>', methods=['GET'])
@cross_origin()
def get_home(page):
    # Create cursor to database and retrieve 10 consecutive tweets
    # sorted by like count. Page number is enumerated from 0 using
    # the page number as an offset of some multiple of 10.
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT *
        from tweets
        ORDER BY likes DESC, id DESC
        OFFSET %s
        FETCH NEXT 10 ROWS ONLY
        """, (int(page) * 10,))
    res = cur.fetchall()
    cur.close()

    for tweet in res:
        # Call Twitter API to get profile data
        user_data = getUserData(tweet['handle'])
        tweet_data = getTweetData(tweet['tweet_id'])

        # Error handling and inserting into return dict
        # for display name and profile image
        if 'name' in user_data:
            tweet['name'] = user_data['name']
        else:
            tweet['name'] = None

        if 'profile_image_url_https' in user_data:
            tweet['image'] = user_data['profile_image_url_https']
        else:
            tweet['image'] = None

        # Create Tweet reply (original prompt)
        tweet['reply'] = dict()

        tweet['reply']['image']  = tweet['image']
        tweet['reply']['name']   = tweet['name']
        tweet['reply']['handle'] = tweet['handle']

        if 'id_str' in tweet_data:
            tweet['reply']['id'] = tweet_data['id_str']
        else:
            tweet['reply']['id'] = None

        if 'created_at' in tweet_data:
            tweet['reply']['date'] = datetime.strftime(datetime.strptime(tweet_data['created_at'] ,'%a %b %d %H:%M:%S +0000 %Y'), '%b %e')
        else:
            tweet['reply']['date'] = None

        if 'full_text' in tweet_data:
            tweet['reply']['tweet'] = tweet_data['full_text']
        else:
            tweet['reply']['tweet'] = None

        if 'retweet_count' in tweet_data:
            tweet['reply']['retweets'] = tweet_data['retweet_count']
        else:
            tweet['reply']['retweets'] = None

        if 'favorite_count' in tweet_data:
            tweet['reply']['likes'] = tweet_data['favorite_count']
        else:
            tweet['reply']['likes'] = None

    return json.dumps(res)


# Generate tweets for a given user
@app.route('/generate/<user>', methods=['GET'])
@cross_origin()
def generate_tweets(user):
    # Remove leading @ symbol in username if necessary
    if user[0] == '@':
        user = user[1:]

    tweets = list()
    data = getUserData(user) # Call Twitter API to get profile data

    # Error handling (invalid user, API error, etc..)
    if 'errors' in data or 'error' in data:
        return json.dumps(tweets)

    # Retrieve some number of tweets from the user's timeline
    # to be used as the prompts for tweet generation
    prompts = getPrompts(user)

    # Iterate through each prompts and construct the generated tweet
    for prompt in prompts:
        tweet = dict()

        tweet['id']     = None # Tweet is considered unregistered
        tweet['likes']  = None # Newly created tweet has no likes
        tweet['handle'] = user # User handle
        tweet['date']   = date.today().strftime('%b %e') # Date formatting
        tweet['tweet']  = generateTweet(prompt['full_text']) # Call tweet generation API

        # Skip if generated tweet is empty string
        if tweet['tweet'] == '':
            continue

        # Error handling and inserting into return dict
        # for display name and profile image
        if 'name' in data:
            tweet['name'] = data['name']
        else:
            tweet['name'] = None

        if 'profile_image_url_https' in data:
            tweet['image'] = data['profile_image_url_https']
        else:
            tweet['image'] = None

        # Create Tweet reply (original prompt)
        tweet['reply'] = dict()

        tweet['reply']['image']  = tweet['image']
        tweet['reply']['name']   = tweet['name']
        tweet['reply']['handle'] = tweet['handle']

        if 'id_str' in prompt:
            tweet['reply']['id'] = prompt['id_str']
        else:
            tweet['reply']['id'] = None

        if 'created_at' in prompt:
            tweet['reply']['date'] = datetime.strftime(datetime.strptime(prompt['created_at'] ,'%a %b %d %H:%M:%S +0000 %Y'), '%b %e')
        else:
            tweet['reply']['date'] = None

        if 'full_text' in prompt:
            tweet['reply']['tweet'] = prompt['full_text']
        else:
            tweet['reply']['tweet'] = None

        if 'retweet_count' in prompt:
            tweet['reply']['retweets'] = prompt['retweet_count']
        else:
            tweet['reply']['retweets'] = None

        if 'favorite_count' in prompt:
            tweet['reply']['likes'] = prompt['favorite_count']
        else:
            tweet['reply']['likes'] = None

        tweets.append(tweet) # Append created tweet to return object

    return json.dumps(tweets)


# Retrieve pre-generated tweets from a database
# for demonstrating expected app functionality
@app.route('/demo/<user>/<page>', methods=['GET'])
@cross_origin()
def generate_tweets_demo(user, page):
    if user[0] == '@':
        user = user[1:]

    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT *
        from demo
        where handle = %s
        OFFSET %s
        FETCH NEXT 10 ROWS ONLY
        """, (user, int(page) * 10,))
    res = cur.fetchall()
    cur.close()

    user_data = getUserData(user)

    for tweet in res:
        prompt = getTweetData(tweet['tweet_id'])

        tweet['id']    = None
        tweet['likes'] = None
        tweet['name']  = None
        tweet['image'] = None
        tweet['date']  = date.today().strftime('%b %e')

        if 'name' in user_data:
            tweet['name'] = user_data['name']

        if 'profile_image_url_https' in user_data:
            tweet['image'] = user_data['profile_image_url_https']

        # Create Tweet reply (original prompt)
        tweet['reply'] = dict()

        tweet['reply']['image']  = tweet['image']
        tweet['reply']['name']   = tweet['name']
        tweet['reply']['handle'] = tweet['handle']

        if 'id_str' in prompt:
            tweet['reply']['id'] = prompt['id_str']
        else:
            tweet['reply']['id'] = None

        if 'created_at' in prompt:
            tweet['reply']['date'] = datetime.strftime(datetime.strptime(prompt['created_at'] ,'%a %b %d %H:%M:%S +0000 %Y'), '%b %e')
        else:
            tweet['reply']['date'] = None

        if 'full_text' in prompt:
            tweet['reply']['tweet'] = prompt['full_text']
        else:
            tweet['reply']['tweet'] = None

        if 'retweet_count' in prompt:
            tweet['reply']['retweets'] = prompt['retweet_count']
        else:
            tweet['reply']['retweets'] = None

        if 'favorite_count' in prompt:
            tweet['reply']['likes'] = prompt['favorite_count']
        else:
            tweet['reply']['likes'] = None

    return json.dumps(res)


if __name__ == '__main__':
    app.run() # Start flask app

