import os, asyncio, aiohttp, pathlib, re

DOCS = {
    # Bucket A
    "raw_docs/A_templates/resume_template_mhlw.pdf":
        "https://www.hellowork.mhlw.go.jp/doc/kouroushourirekisho.pdf",
    "raw_docs/A_templates/shokumukeirekisho_mynavi.html":
        "https://tenshoku.mynavi.jp/knowhow/sample/download/",
    "raw_docs/A_templates/shokumukeirekisho_rikunabi.html":
        "https://next.rikunabi.com/tenshokuknowhow/shokurekisho/",
    "raw_docs/A_templates/se_template_doda.html":
        "https://doda.jp/guide/syokureki/resume/it01.html",

    # Bucket B
    "raw_docs/B_bullets/bullets_it_success.txt":
        "https://www.hop-job.com/service/s004/",
    "raw_docs/B_bullets/bullets_frontend.txt":
        "https://high-five.careers/column/work-experience-document/",
    "raw_docs/B_bullets/bullets_se_levtech.html":
        "https://career.levtech.jp/guide/knowhow/article/259/",

    # Bucket C
    "raw_docs/C_keigo/keigo_list_mynavi.html":
        "https://mynavi-agent.jp/dainishinsotsu/canvas/2019/04/post-164.html",
    "raw_docs/C_keigo/keigo_pdf_tempstaff.pdf":
        "https://www.tempstaff.co.jp/staff/skillup/educationaltraining/guidance/pdf02.pdf",
    "raw_docs/C_keigo/business_mail_template.html":
        "https://business-mail.jp/example",

    # Bucket D
    "raw_docs/D_rules/ng_words_careerlog.html":
        "https://career-log.jp/guide/resume-ngwords/",
    "raw_docs/D_rules/ng_points_neocareer.html":
        "https://www.neo-career.co.jp/careertrus/rirekisyo_ng",
    "raw_docs/D_rules/absolute_ngwords_diamond.html":
        "https://diamond.jp/articles/-/366616",
}

async def fetch(session, url, dest):
    os.makedirs(pathlib.Path(dest).parent, exist_ok=True)
    async with session.get(url, timeout=60) as resp:
        resp.raise_for_status()
        data = await resp.read()
    pathlib.Path(dest).write_bytes(data)
    print(f"{dest}")

async def main():
    async with aiohttp.ClientSession(headers={"User-Agent": "resume-crawler"}) as s:
        await asyncio.gather(*(fetch(s, u, d) for d, u in DOCS.items()))

if __name__ == "__main__":
    asyncio.run(main())
