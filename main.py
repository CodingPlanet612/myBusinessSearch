import requests
import json
from flask import Flask, send_from_directory, request

app = Flask(__name__)

# Reference: YouTube:https://www.youtube.com/watch?v=GJf7ccRIK4U
@app.route('/search')    
def business_search():  # put application's code here

    # Define the API key, Define the Endpoint, and define the Header
    KEY_API = 'Nz_cJ4RrIO9IkD6xwcIfWsBTQzAq4_Kk1p_XUwQzGI29PptDLCUNOjgt_o3S7qFxP0Qmssd1Sr2KlsGHJvyMqtt5aC4ROhR7Ky48gxsVLp84KNHupnT9ICBV3iktY3Yx'
    ENDPOINT = 'https://api.yelp.com/v3/businesses/search'
    HEADERS = {'Authorization': f'bearer {KEY_API}'}

    arg = request.args
    search_request = arg.to_dict()

    # Define the parameters
    PARAMETERS = {'term': search_request['keyword'],
                  'latitude': (float)(search_request['latt']),
                  'longitude': (float)(search_request['lngg']),
                  'categories': search_request['category'],
                  'radius': (int)(search_request['distance'])*1600}

    # print(search_request['keyword'])
    # print((float)(search_request['latt']))
    # print((float)(search_request['lngg']))
    # print(search_request['category'])
    # print((int)(search_request['distance']*1600)

    # Make a request to the yelp API
    response = requests.get(url=ENDPOINT, params=PARAMETERS, headers=HEADERS)

    # Convert the JSON string into a dictionary object
    business_data = response.json()

    print(business_data)

    # # Loop through the response and get each category
    # for biz in business_data['bus']:
    #     return(biz[''])
    # return business_data
    return business_data


# Reference: YouTube:https://www.youtube.com/watch?v=jEYu0yCw12s&t=529s
@app.route('/details')
def business_details():  # put application's code here
    arg = request.args
    search_request = arg.to_dict()

    business_id=search_request["businessId"]

    # Define the API key, Define the Endpoint, and define the Header
    KEY_API = 'Nz_cJ4RrIO9IkD6xwcIfWsBTQzAq4_Kk1p_XUwQzGI29PptDLCUNOjgt_o3S7qFxP0Qmssd1Sr2KlsGHJvyMqtt5aC4ROhR7Ky48gxsVLp84KNHupnT9ICBV3iktY3Yx'
    ENDPOINT = 'https://api.yelp.com/v3/businesses/{}'.format(business_id)
    HEADERS = {'Authorization': f'bearer {KEY_API}'}

    # Make a request to the yelp API
    response = requests.get(url=ENDPOINT, headers=HEADERS)

    # Convert the JSON string into a dictionary object
    detail_data = response.json()

    # print(detail_data)
    return detail_data


@app.route('/', methods = ['GET'])
def home():
    return send_from_directory('static', 'business_search.html', as_attachment=False)


if __name__ == '__main__':
    app.run(debug=True)
