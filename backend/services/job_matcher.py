from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

vectorizer = TfidfVectorizer(
    stop_words=["the", "is", "in", "and", "to", "a"], 
    ngram_range=(1, 2),  # Unigrams and bigrams
    max_features=1000,   # Limit to top 1000 features
    use_idf=True,
    smooth_idf=True,
    sublinear_tf=True
)

def match_jobs_tfidf(resume_text: str, job_descriptions: list[str]) -> list[int]:
    # Fit TF-IDF on all documents (resume + jobs)
    all_texts = [resume_text] + job_descriptions
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    
    # Calculate cosine similarity
    resume_vector = tfidf_matrix[0:1]
    job_vectors = tfidf_matrix[1:]
    similarities = cosine_similarity(resume_vector, job_vectors)
    
    # Return sorted job indices
    return np.argsort(-similarities[0])


jobs = match_jobs_tfidf( "Junior software engineer with a passion for developing innovative programs that expedite the efficiency and effectiveness of organizational success.", ["Software Engineer with 5+ years of experience in developing scalable web applications.", "Junior Developer with a passion for learning and growth.", "Project Manager with a track record of successful project delivery."])
print("Matched job indices:", jobs)