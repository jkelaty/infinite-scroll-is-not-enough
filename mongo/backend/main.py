from datetime import datetime
from bson.objectid import ObjectId

from flask import Blueprint, request, jsonify

from .extensions import mongo

main = Blueprint('main', __name__)

#   Find out how to insert data
#   Insert into toptweets
@main.route('/tweet')
def tweet():
    # top_tweet_collect = mongo.db.topTweets
    # top_tweet_collect.remove()

    tweets_collect = mongo.db.tweets
    # tweets_collect.remove()

    todaysDate = datetime.date(datetime.today())
    dateStr = str(todaysDate.month) + "/" + str(todaysDate.day) + "/" + str(todaysDate.year)

    documentObj = {
        'handle' : "user",
        'content' : "content",
        'date' : dateStr,
        'likes' : 0
    }
    
    # top_tweet_collect.insert_one(documentObj)
    tweets_collect.insert_one(documentObj)

    tag = "<ol>"
    for tweet in tweets_collect.find({}):
        tag += "<li>" + str(tweet['_id']) + "</li>"
    tag += "</ol>"

    return tag

#   This route returns all the top tweets
@main.route('/topTweets', methods = ['GET'])
def topTweets():
    try:
        tweets = mongo.db.tweets
        #   Sorts the tweets based on amount of likes
        topTweets = tweets.find().sort('likes', -1)
        colletionSize = topTweets.count()
        size = colletionSize if colletionSize < 5 else 5

        tag = "<h1>Top Tweets</h1><ol>"
        for i in range(size):
            tag += '<li> {handle} posted {content} </li>'.format(
                handle = topTweets[i]['handle'],
                content = topTweets[i]['content']
            )
        tag += '</ol>'
    except Exception as e:
        tag = "Error: " + str(e)

    return tag
    
#   Liking a tweet
@main.route('/tweet/like/<tweetID>', methods = ['POST']) # or update?   
def like(tweetID):
    result = ""
    try:
        collection = mongo.db.tweets
        tweetObj = collection.find_one({'_id' : ObjectId(tweetID)})
        if tweetObj == None:
            raise ValueError
        updateLikes = tweetObj['likes'] + 1
        collection.update_one(
            { '_id' : ObjectId(tweetID) } , 
            { 
                "$set" :
                {
                    'likes' : updateLikes
                }
            }
        )
        result = 'Liked! Likes count: {likes}'.format( likes = updateLikes)
    except Exception as e: 
        result = "Error: " + str(e) 
    return result

#   Unlike a tweet
@main.route('/tweet/unlike/<tweetID>', methods = ['POST'])
def unlike(tweetID):
    result = ""
    try:
        collection = mongo.db.tweets
        tweetObj = collection.find_one({'_id' : ObjectId(tweetID)})
        if tweetObj == None:
            raise ValueError
        updateLikes = tweetObj['likes'] - 1
        collection.update_one(
            { '_id' : ObjectId(tweetID) } , 
            { 
                "$set" :
                {
                    'likes' : updateLikes
                }
            }
        )
        result = 'Unliked! Likes count: {likes}'.format( likes = updateLikes)
    except Exception as e: 
        result = "Error: " + str(e) 
    return result

#   Still need to figure out what it will return
#   Share tweet
@main.route('/share/<tweetID>', methods = ['GET'])
def share(tweetID):
    try:
        tweets_collect = mongo.db.tweets
        tweet = tweets_collect.find_one({'_id' : ObjectId(tweetID)})

        return str(tweet)
    except Exception as e:
        return str(e)

    return 'pass'

#   Fetch tweets from input
@main.route('/tweets/<handle>', methods = ['GET'])
def fetchTweets(handle):
    return 'fetchTweets'
