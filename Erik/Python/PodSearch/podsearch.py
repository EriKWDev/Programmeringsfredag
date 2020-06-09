
import requests
from bs4 import BeautifulSoup

feed_name = "Hello Internet"
url = "http://www.hellointernet.fm/podcast?format=rss"
response = requests.get(url)

soup = BeautifulSoup(response.content)
for item in soup.find_all("item"):
    print()
    print(item.title.get_text())
    print(item.enclosure["url"])