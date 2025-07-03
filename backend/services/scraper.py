from bs4 import BeautifulSoup
import requests

r = requests.get("https://jobs.gaijinpot.com/en/job")

soup = BeautifulSoup(r.content, "lxml")

def scrape_jobs():
    jobs = []
    job_listings = soup.find_all("div", class_="card")
    for job in job_listings:
        title_card = job.find("div", class_="card-header")
        title = title_card.find("a").text.strip()
        job_description = job.find("dl")
        company = job_description.find("dt", string="Company").find_next_sibling("dd").text.strip()
        location = job_description.find("dt", string="Location").find_next_sibling("dd").text.strip()
        jobs.append({
            "id": len(jobs) + 1, 
            "title": title,
            "company": company,
            "location": location,
        })
    return jobs