from flask           import Flask, request
from flask_cors      import CORS, cross_origin
from psycopg2.extras import RealDictCursor
from twitter         import getTwitterData, getPrompts, generateTweet
from datetime        import date

import os
import json
import math
import psycopg2

DATABASE_URL = os.environ['DATABASE_URL']
conn = psycopg2.connect(DATABASE_URL, sslmode='require')

app = Flask(__name__)
CORS(app)

app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/register/', methods=['POST'])
@cross_origin()
def register_tweet():
    data = request.json

    if not('handle' in data and 'date' in data and 'tweet' in data):
        return json.dumps(list())

    if data['handle'] == '' or data['date'] == '' or data['tweet'] == '':
        return json.dumps(list())

    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        INSERT INTO tweets
        (handle, date, tweet)
        VALUES(%s, %s, %s)
        RETURNING id
        """, (data['handle'], data['date'], data['tweet'],))
    res = cur.fetchall()
    cur.close()
    conn.commit()

    return json.dumps(res)


@app.route('/like/<tweet_id>', methods=['GET'])
@cross_origin()
def like_tweet(tweet_id):
    cur1 = conn.cursor(cursor_factory=RealDictCursor)
    cur1.execute("""
        SELECT likes
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res1 = cur1.fetchall()
    cur1.close()

    if len(res1) == 0:
        return json.dumps(res1)

    cur2 = conn.cursor(cursor_factory=RealDictCursor)
    cur2.execute("""
        UPDATE tweets
        SET likes = %s
        WHERE id = %s
        """, (int(res1[0]['likes'] + 1), int(tweet_id),))
    cur2.close()
    conn.commit()

    cur3 = conn.cursor(cursor_factory=RealDictCursor)
    cur3.execute("""
        SELECT likes
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res3 = cur3.fetchall()
    cur3.close()

    return json.dumps(res3)


@app.route('/unlike/<tweet_id>', methods=['GET'])
@cross_origin()
def unlike_tweet(tweet_id):
    cur1 = conn.cursor(cursor_factory=RealDictCursor)
    cur1.execute("""
        SELECT likes
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res1 = cur1.fetchall()
    cur1.close()

    if len(res1) == 0 or res1[0]['likes'] == 0:
        return json.dumps(res1)

    cur2 = conn.cursor(cursor_factory=RealDictCursor)
    cur2.execute("""
        UPDATE tweets
        SET likes = %s
        WHERE id = %s
        """, (int(res1[0]['likes'] - 1), int(tweet_id),))
    cur2.close()
    conn.commit()

    cur3 = conn.cursor(cursor_factory=RealDictCursor)
    cur3.execute("""
        SELECT likes
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res3 = cur3.fetchall()
    cur3.close()

    return json.dumps(res3)


@app.route('/tweet/<tweet_id>', methods=['GET'])
@cross_origin()
def get_tweet(tweet_id):
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT *
        from tweets
        where id = %s
        """, (int(tweet_id),))
    res = cur.fetchall()
    cur.close()

    for tweet in res:
        data = getTwitterData(tweet['handle'])

        if 'name' in data:
            tweet['name'] = data['name']
        else:
            tweet['name'] = None

        if 'profile_image_url_https' in data:
            tweet['image'] = data['profile_image_url_https']
        else:
            tweet['image'] = None
            
    return json.dumps(res)


@app.route('/home/<page>', methods=['GET'])
@cross_origin()
def get_home(page):
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""
        SELECT *
        from tweets
        ORDER BY likes DESC
        OFFSET %s
        FETCH NEXT 10 ROWS ONLY
        """, (int(page) * 10,))
    res = cur.fetchall()
    cur.close()

    for tweet in res:
        data = getTwitterData(tweet['handle'])

        if 'name' in data:
            tweet['name'] = data['name']
        else:
            tweet['name'] = None

        if 'profile_image_url_https' in data:
            tweet['image'] = data['profile_image_url_https']
        else:
            tweet['image'] = None

    return json.dumps(res)


@app.route('/generate/<user>', methods=['GET'])
@cross_origin()
def generate_tweets(user):
    if user[0] == '@':
        user = user[1:]

    tweets = list()
    data = getTwitterData(user)

    if 'errors' in data or 'error' in data:
        return json.dumps(tweets)

    prompts = getPrompts(user)

    for prompt in prompts:
        tweet = dict()

        tweet['id']     = None
        tweet['likes']  = None
        tweet['handle'] = user
        tweet['date']   = date.today().isoformat()
        tweet['tweet']  = generateTweet(prompt)

        if tweet['tweet'] == '':
            continue

        if 'name' in data:
            tweet['name'] = data['name']
        else:
            tweet['name'] = None

        if 'profile_image_url_https' in data:
            tweet['image'] = data['profile_image_url_https']
        else:
            tweet['image'] = None

        tweets.append(tweet)

    return json.dumps(tweets)


if __name__ == '__main__':
    app.run()

