import time
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

english_word = 'Hello'
finnish_word = 'Hei'

def delete_word_pair_item():
    list_items = webdriver.find_elements(By.CLASS_NAME, 'editListItemDiv')
    item_exists = None
    for item in list_items:
        p_elements = item.find_elements(By.TAG_NAME, 'p')
        tmp_list = []
        for e in p_elements:
            tmp_list.append(e.text)
        if english_word.lower() in tmp_list and finnish_word.lower() in tmp_list:
            item_exists = item
            break
    if item_exists != None:
        delete_button = item_exists.find_element(By.CLASS_NAME, 'editListItemLast')
        delete_button.click()

# Navigate to the website
webdriver = webdriver.Firefox()
webdriver.get('https://language-trainer-project.herokuapp.com')

# Navigate to the edit page
webdriver.find_element(By.CLASS_NAME, 'last-nav-item').click()


# Check if word pair exists already and if id does, delete it
try:
    element = WebDriverWait(webdriver, 2, poll_frequency=0.2).until(
        EC.presence_of_element_located((By.CLASS_NAME, "editListItemDiv"))
    )
finally:
    delete_word_pair_item()

# Add a new word pair
webdriver.find_element(By.XPATH, "//*[contains(text(), 'Add new ')]").click()

input_english = webdriver.find_element(By.XPATH, "//input[@placeholder='English']")
input_english.send_keys(english_word)
input_finnish = webdriver.find_element(By.XPATH, "//input[@placeholder='Finnish']")
input_finnish.send_keys(finnish_word)

webdriver.find_element(By.CLASS_NAME, 'editPopupDone').click()

# Navigate to the front page
webdriver.find_element(By.XPATH, "//a[contains(@href, '/')]").click()

# Press start
webdriver.find_element(By.XPATH, "//*[contains(text(), 'Start')]").click()

# Test the translation
list = webdriver.find_elements(By.CLASS_NAME, 'examListItem')
last_element = list[-1:]

for element in last_element:
    div = element.find_element(By.CLASS_NAME, 'wordsDiv')
    inside_div = div.find_elements(By.XPATH, './*')
    input = inside_div[-1:]
    for i in input:
        i.send_keys('Hei')

webdriver.find_element(By.CLASS_NAME, 'buttonResults').click()

# Navigate to the edit page
webdriver.find_element(By.CLASS_NAME, 'last-nav-item').click()

# Delete the word pair
delete_word_pair_item()

webdriver.quit()

print("Test successfull!")