import json, os, time
from pathlib import Path
from pprint import pprint

from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError

OUTPUT_PATH = "output"
CONVERSATION_FOLDER = "conversations"

OUTPUT_CHANNELS_FILE = "dm_channels.json"
OUTPUT_USERS_FILE = "dm_users.json"
OUTPUT_CONVERSATION_FILE_FORMATTER = "dm_convo_{id}.json"

CONVERSATION_HISTORY_API_RATE_LIMIT = .25

def archive_channels_dict():
    """ Collect all channel information and store it """

    response = client.conversations_list(
        types="im, mpim",
        limit=200
    )

    channels = {}

    for item in response:
        pprint(item["channels"])
        for channel in item["channels"]:
            channels[channel["id"]] = channel

    filename = Path(OUTPUT_PATH) /  OUTPUT_CHANNELS_FILE
    save_file(filename, channels)

def archive_users_dict():
    """ Collect all user information and store it """
    response = client.users_list(
        limit=200
    )

    users = {}

    for item in response:
        for user in item["members"]:
            users[user["id"]] = user

    filename = Path(OUTPUT_PATH) / OUTPUT_USERS_FILE
    save_file(filename, users)

def archive_all_conversations(channels):
    """ Iterate through the given channels dict and attempt to archive all coversations. """

    for channel in channels.keys():
        convo_id = channel
        filename = Path(OUTPUT_PATH) / CONVERSATION_FOLDER / OUTPUT_CONVERSATION_FILE_FORMATTER.format(id = convo_id)
        if filename.exists():
            # If we've already got the file, just skip it.
            continue
        else:
            archive_conversation_dict(convo_id)
            time.sleep(CONVERSATION_HISTORY_API_RATE_LIMIT) # conversations.history rate limit is Tier 3 (~500 requests/min)

def archive_conversation_dict(convo_id):
    """ Try to save the conversation response as a separate file under output/conversations. """

    try:
        response = client.conversations_history(
            channel=convo_id, limit=200
            )

        messages = []
        for item in response:
            for message in item["messages"]:
                messages.insert(0, message)
        
        filename = Path(OUTPUT_PATH) / CONVERSATION_FOLDER / OUTPUT_CONVERSATION_FILE_FORMATTER.format(id = convo_id)
        print(filename)
        save_file(filename, messages)
    except Exception as error:
        print(error.message)
        input("Press enter to continue...")

def save_file(filename, data):
    """ Create standard output folders if necessary then save data with filename """
    create_folders()
    json_object = json.dumps(data, indent = 4) 
    with open(filename, "w") as outfile: 
        outfile.write(json_object) 

def create_folders():
    """ Before saving anything, call this to make sure the script's expected folders are set up. """
    output_path = Path(OUTPUT_PATH)

    if not output_path.exists():
        os.mkdir(output_path)
    
    conversations_path = output_path / CONVERSATION_FOLDER

    if not conversations_path.exists():
        os.mkdir(conversations_path)

def load_channels_dict():
    """ Load the local channels directory if it exists. """

    filename = Path(OUTPUT_PATH) /  OUTPUT_CHANNELS_FILE

    if not filename.exists():
        print("No channels dictionary found.")
        return None

    with open(filename) as outfile: 
        return json.load(outfile)
    
def reverse_file(filename):
    """ One-off used to reverse message order in previous downloaded versions of conversations. """

    print(f"Reversing {filename}") 

    with open(filename) as outfile:
        messages = json.load(outfile)
    
    os.remove(filename)

    messages.reverse()

    save_file(filename, messages)

def rename_files():
    channels = load_channels_dict()
    for channel in channels.keys():
        convo_id = channel
        filename = Path(OUTPUT_PATH) / CONVERSATION_FOLDER / OUTPUT_CONVERSATION_FILE_FORMATTER.format(id = convo_id)

        with open(filename) as outfile:
            messages = json.load(outfile)

        os.remove(filename)

        filename = Path(OUTPUT_PATH) / CONVERSATION_FOLDER / OUTPUT_CONVERSATION_FILE_FORMATTER_NEW.format(id = convo_id)

        save_file(filename, messages)

client = WebClient(token=os.environ['SLACK_USER_TOKEN'])

#channels = load_channels_dict()
archive_channels_dict()
print("Channels saved.")
archive_users_dict()
print("Users saved.")

channels = load_channels_dict()
archive_all_conversations(channels)
print("Conversations saved.")

print("Finished.")
        


"""
channels = load_channels_dict() 
for channel in channels.keys():
    archive_conversation_dict(channel)
    time.sleep(.25) 
"""


"""
try:
    response = client.chat_postMessage(channel='#dotbot-dev', text="Hello world!")
    assert response["message"]["text"] == "Hello world!"
except SlackApiError as e:
    # You will get a SlackApiError if "ok" is False
    assert e.response["ok"] is False
    assert e.response["error"]  # str like 'invalid_auth', 'channel_not_found'
    print(f"Got an error: {e.response['error']}")
"""

