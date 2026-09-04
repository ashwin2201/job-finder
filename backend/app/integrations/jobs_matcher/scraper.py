from bs4 import BeautifulSoup
import requests

base_url = "https://jobs.gaijinpot.com"

def scrape_jobs():
    response = requests.get(base_url + "/en/job", timeout=15)
    response.raise_for_status()
    soup = BeautifulSoup(response.content, "lxml")
    jobs = []
    job_listings = soup.find_all("div", class_="card")
    for job in job_listings:
        title_card = job.find("div", class_="card-header")
        title = title_card.find("a").text.strip()
        job_description = job.find("dl")
        company = job_description.find("dt", string="Company").find_next_sibling("dd").text.strip()
        location = job_description.find("dt", string="Location").find_next_sibling("dd").text.strip()

        detail_card = title_card.find_next_sibling("div", class_="card-item")
        description = get_job_description(detail_card)

        jobs.append({
            "id": len(jobs) + 1, 
            "title": title,
            "company": company,
            "location": location,
            "description": description
        })

    return jobs

def get_job_description(job: BeautifulSoup):
    job_id = job.find("a", class_="card-image")
    if not job_id:
        return "No job description available"
    job_id = job_id['href']
    print(f"Fetching job description for ID: {job_id}")
    job_description_page = base_url + job_id
    job_description_response = requests.get(job_description_page, timeout=15)
    job_description_response.raise_for_status()
    job_description_soup = BeautifulSoup(job_description_response.content, "lxml")
    description = job_description_soup.find("p", class_="card-item").text.strip()
    return description
