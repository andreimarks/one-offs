from localconfig import *

import json, os, time
from pathlib import Path
from pprint import pprint

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains 

OUTPUT_PATH = "output"
OUTPUT_FILE_IDS = "dm_ids.json"

def get_dm_ids():
    """Parse the dm_ids dict file from the output folder if it exists, otherwise create the folder and return an empty dict."""
    dm_ids = {}

    output_folder = Path(OUTPUT_PATH)

    if not output_folder.exists():
        os.mkdir(output_folder)

    dm_ids_file = output_folder / OUTPUT_FILE_IDS
    if dm_ids_file.exists():
        with open(dm_ids_file) as file:
            dm_ids = json.load(file)

    return dm_ids

def scrape_dm_pages(dm_ids):
    """Navigate to each page in the dm_ids dictionary and scrape all messages."""

    pass


#-----------------------------------------------------

# First see if we've already got our dm ids
should_open_new_browser = True

if (should_open_new_browser):
    driver = webdriver.Chrome()
    driver.get(f"https://app.slack.com/client/{SLACK_ID}/all-dms")

    url = driver.command_executor._url
    session_id = driver.session_id

    print(url)
    print(session_id)
else:
    url = "http://127.0.0.1:38099"
    session_id = "6e3fe34f41b5e60981186a6af657c5f6"
    driver = webdriver.Remote(command_executor=url, desired_capabilities={})
    driver.close()
    driver.session_id = session_id

input("Press Enter to continue...")

dm_ids = get_dm_ids()
if (len(dm_ids) > 0):
    scrape_dm_pages(dm_ids)

raise Exception("Stop here for now.")

# Delete sidebar to limit amount of elements we search.
sidebar = driver.find_elements_by_class_name("c-virtual_list__scroll_container")[0]
driver.execute_script("arguments[0].remove()", sidebar)

list_items = driver.find_elements_by_class_name("c-virtual_list__item")

while len(list_items) > 0:
    name_finding_finished = True

    loop_limit = 8 # after testing, kind of an okay amount of batching for dynamic loading.
    loop_counter = 0

    for list_item in list_items:
        list_item_id = list_item.get_attribute("id")

        if list_item_id in dm_ids:
            continue

        list_item_children = list_item.find_elements_by_xpath(".//*") # This could be smarter.

        found_names = False

        for list_item_child in list_item_children:
            if list_item_child.get_attribute("class") == "p-recent_page__conversation__name":
                print(list_item_child.text)
                found_names = True
                name_finding_finished = False
                break

        if found_names:
            dm_ids[list_item_id] = list_item_child.text
            list_item.send_keys(Keys.ARROW_DOWN)
            loop_counter += 1
        
        if loop_counter >= loop_limit:
            loop_counter = 0
            break
    
    # Get ids from `c-virtual_list__item` classes
    list_items = driver.find_elements_by_class_name("c-virtual_list__item")

    # Remove the element to reduce noise.
    print("----------------------------")

    if name_finding_finished:
        print("All done!")
        break

# Serialize json  
json_object = json.dumps(dm_ids, indent = 4) 
  
# Writing to sample.json 
filename = Path(OUTPUT_PATH) / OUTPUT_FILE_IDS
with open(filename, "w") as outfile: 
    outfile.write(json_object) 

    """ Abandon -- Iterating through the list while deleting/reloading too complex
    for index, list_item in enumerate(list_items):
        list_item_children = list_item.find_elements_by_xpath(".//*")
        found_names = False
        for list_item_child in list_item_children:
            try:
                if list_item_child.get_attribute("class") == "p-recent_page__conversation__name":
                    print(list_item_child.text)
                    found_names = True
            except:
                print("oops")

        # Append id to the list for later
        if found_names:
            dm_ids.append(list_item.get_attribute("id"))


        list_item.send_keys(Keys.ARROW_DOWN)
        # Remove the element to reduce noise.
        driver.execute_script("arguments[0].remove()", list_item)
        print("----------------------------")
    """

    """ Abandon -- Click on To: input plus down arrow only works once....
    recent_page_select = driver.find_element_by_id("recent_page__select")
    recent_page_select.click()
    recent_page_select.send_keys(Keys.ARROW_DOWN)
    """

# Bleh vvvv scrolling an element isn't going to happen for now.
"""
buttons = driver.find_elements_by_class_name("c-virtual_list__item")
print(len(buttons))
for button in buttons:
    print(button.get_attribute("id"))
"""

"""
#scroll_down(driver)

element = driver.find_element_by_class_name("p-workspace__primary_view_contents")
body = driver.find_element_by_tag_name("body")
elements = driver.find_elements_by_class_name("c-virtual_list__scroll_container")
print(len(elements))
#driver.execute_script("arguments[0].remove()", elements[1])
first_click = driver.find_element_by_id("recent_page__select")
#first_click.send_keys('12345')
#first_click.click()

x_top_anchor = driver.find_element_by_id("Xtop_anchor")
#x_top_anchor.click()

#elements[1].click()

recent_page_list = driver.find_element_by_class_name("p-recent_page__list")

actions = ActionChains(driver)
actions.move_to_element(x_top_anchor)
actions.click()
actions.send_keys(Keys.DOWN)
actions.send_keys(Keys.DOWN)
actions.send_keys(Keys.DOWN)
actions.send_keys(Keys.DOWN)
actions.send_keys(Keys.DOWN)
actions.perform()

scroll_amount = 100
for i in range(10):
    print("Send keys")
    #body.send_keys(Keys.DOWN)
    #first_click.send_keys(Keys.ARROW_DOWN)
    #element.send_keys(Keys.PAGE_DOWN)
    #driver.execute_script("return document.getElementsByClassName('c-virtual_list__scroll_container')[0].remove();")
    #driver.execute_script(f"arguments[0].scrollHeight = {scroll_amount}", recent_page_list)
    #driver.execute_script("scroll(0, 250)")
    #x_top_anchor.send_keys(Keys.ARROW_DOWN)
    
    
    actions.reset_actions().send_keys(Keys.DOWN).perform()
    time.sleep(.33)

    scroll_amount -= 100
    print(scroll_amount)
"""

"""
# https://tarunlalwani.com/post/reusing-existing-browser-session-selenium/
# https://stackoverflow.com/questions/43478965/find-out-all-child-elements-xpath-from-parent-xpath-using-selenium-webdriver-in
# https://www.selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html
# https://stackoverflow.com/questions/36476861/selenium-webelement-object-has-no-attribute-get-attribute
# https://stackoverflow.com/questions/20996392/how-to-get-text-with-selenium-webdriver-in-python
# https://stackoverflow.com/questions/40734794/retrieve-id-of-any-element-using-webdriver-in-python-given-value-of-the-element
# https://medium.com/@ageitgey/python-3-quick-tip-the-easy-way-to-deal-with-file-paths-on-windows-mac-and-linux-11a072b58d5f
"""