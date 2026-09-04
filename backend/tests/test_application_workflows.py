import os
import unittest
from datetime import datetime, timezone
from uuid import UUID, uuid4

os.environ.setdefault("PG_CONN", "sqlite://")

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.testclient import TestClient
from sqlalchemy.pool import StaticPool
from sqlmodel import Session, SQLModel, create_engine

import models  # noqa: F401
from api.router import api_router
from core.auth import get_current_user
from core.database import get_session
from models.company import Company, CompanyMembership
from models.identity import User, UserProfile
from models.job import Job


class ApplicationWorkflowTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        SQLModel.metadata.create_all(cls.engine)

        cls.candidate_id = uuid4()
        cls.recruiter_id = uuid4()
        cls.company_id = uuid4()
        cls.job_id = uuid4()
        cls.second_job_id = uuid4()

        with Session(cls.engine) as session:
            session.add(
                User(
                    id=cls.candidate_id,
                    display_name="Candidate",
                    profile=UserProfile(
                        headline="Python developer",
                        visibility="public",
                    ),
                )
            )
            session.add(
                User(
                    id=cls.recruiter_id,
                    display_name="Recruiter",
                    profile=UserProfile(
                        headline="Technical recruiter",
                        visibility="public",
                    ),
                )
            )
            session.add(
                Company(
                    id=cls.company_id,
                    name="Example Company",
                    slug="example-company",
                )
            )
            session.add(
                CompanyMembership(
                    company_id=cls.company_id,
                    user_id=cls.recruiter_id,
                    role="recruiter",
                    status="active",
                )
            )
            now = datetime.now(timezone.utc)
            session.add(
                Job(
                    id=cls.job_id,
                    company_id=cls.company_id,
                    title="Python Engineer",
                    description="Build Python FastAPI services and PostgreSQL APIs.",
                    location="Tokyo",
                    status="published",
                    published_at=now,
                )
            )
            session.add(
                Job(
                    id=cls.second_job_id,
                    company_id=cls.company_id,
                    title="Product Designer",
                    description="Design product interfaces and research workflows.",
                    location="Remote",
                    status="published",
                    published_at=now,
                )
            )
            session.commit()

        def override_session():
            with Session(cls.engine) as session:
                yield session

        def override_current_user(
            request: Request,
            session: Session = Depends(get_session),
        ):
            raw_user_id = request.headers.get("x-test-user-id")
            if raw_user_id is None:
                raise HTTPException(status_code=401, detail="Test user required")
            user = session.get(User, UUID(raw_user_id))
            if user is None:
                raise HTTPException(status_code=401, detail="Test user not found")
            return user

        app = FastAPI()
        app.include_router(api_router)
        app.dependency_overrides[get_session] = override_session
        app.dependency_overrides[get_current_user] = override_current_user
        cls.client = TestClient(app)

    def auth(self, user_id):
        return {"x-test-user-id": str(user_id)}

    def test_job_filters_are_applied_before_pagination(self):
        response = self.client.get(
            "/api/jobs",
            params={
                "page": 1,
                "page_size": 1,
                "q": "Product Designer",
            },
        )

        self.assertEqual(response.status_code, 200)
        page = response.json()
        self.assertEqual(page["total"], 1)
        self.assertEqual(page["total_pages"], 1)
        self.assertEqual(len(page["items"]), 1)
        self.assertEqual(page["items"][0]["id"], str(self.second_job_id))

        remote_response = self.client.get(
            "/api/jobs",
            params={
                "page": 1,
                "page_size": 1,
                "work_styles": "Remote",
            },
        )
        self.assertEqual(remote_response.status_code, 200)
        self.assertEqual(remote_response.json()["total_pages"], 1)
        self.assertEqual(
            remote_response.json()["items"][0]["id"],
            str(self.second_job_id),
        )

    @classmethod
    def tearDownClass(cls):
        cls.client.close()
        cls.engine.dispose()

    def test_complete_candidate_and_employer_workflow(self):
        candidate_headers = self.auth(self.candidate_id)
        recruiter_headers = self.auth(self.recruiter_id)

        resume_response = self.client.post(
            "/api/me/resumes",
            headers=candidate_headers,
            json={
                "title": "Backend resume",
                "content": (
                    "Python engineer building FastAPI services and PostgreSQL APIs."
                ),
                "is_primary": True,
            },
        )
        self.assertEqual(resume_response.status_code, 201)
        resume_id = resume_response.json()["id"]

        feedback_response = self.client.post(
            f"/api/me/resumes/{resume_id}/feedback",
            headers=candidate_headers,
            json={
                "source": "system",
                "summary": "Strong backend focus.",
                "strengths": "Clear API experience.",
                "improvements": "Add measurable outcomes.",
                "score": 82,
            },
        )
        self.assertEqual(feedback_response.status_code, 201)

        generated_feedback_response = self.client.post(
            f"/api/me/resumes/{resume_id}/feedback/generate",
            headers=candidate_headers,
        )
        self.assertEqual(generated_feedback_response.status_code, 201)
        self.assertIsNotNone(generated_feedback_response.json()["score"])

        second_resume_response = self.client.post(
            "/api/me/resumes",
            headers=candidate_headers,
            json={
                "title": "Primary resume",
                "content": "Python FastAPI PostgreSQL backend engineer.",
                "is_primary": True,
            },
        )
        self.assertEqual(second_resume_response.status_code, 201)

        resume_list_response = self.client.get(
            "/api/me/resumes",
            headers=candidate_headers,
        )
        primary_resumes = [
            resume
            for resume in resume_list_response.json()
            if resume["is_primary"]
        ]
        self.assertEqual(len(primary_resumes), 1)
        self.assertEqual(
            primary_resumes[0]["id"],
            second_resume_response.json()["id"],
        )

        save_response = self.client.put(
            f"/api/me/saved-jobs/{self.job_id}",
            headers=candidate_headers,
        )
        self.assertEqual(save_response.status_code, 200)
        self.assertEqual(save_response.json()["job"]["id"], str(self.job_id))

        application_response = self.client.post(
            f"/api/jobs/{self.job_id}/applications",
            headers=candidate_headers,
            json={
                "resume_id": resume_id,
                "cover_letter": "I build APIs like these.",
            },
        )
        self.assertEqual(application_response.status_code, 201)
        application_id = application_response.json()["id"]
        self.assertEqual(application_response.json()["status"], "submitted")

        duplicate_response = self.client.post(
            f"/api/jobs/{self.job_id}/applications",
            headers=candidate_headers,
            json={},
        )
        self.assertEqual(duplicate_response.status_code, 409)

        unauthorized_employer_response = self.client.get(
            f"/api/companies/{self.company_id}/applications",
            headers=candidate_headers,
        )
        self.assertEqual(unauthorized_employer_response.status_code, 403)

        employer_list_response = self.client.get(
            f"/api/companies/{self.company_id}/applications",
            headers=recruiter_headers,
        )
        self.assertEqual(employer_list_response.status_code, 200)
        self.assertEqual(len(employer_list_response.json()), 1)
        self.assertEqual(
            employer_list_response.json()[0]["resume"]["id"],
            resume_id,
        )

        review_response = self.client.patch(
            (
                f"/api/companies/{self.company_id}/applications/"
                f"{application_id}"
            ),
            headers=recruiter_headers,
            json={"status": "reviewing", "employer_note": "Strong API work."},
        )
        self.assertEqual(review_response.status_code, 200)
        self.assertEqual(review_response.json()["status"], "reviewing")

        invalid_transition_response = self.client.patch(
            (
                f"/api/companies/{self.company_id}/applications/"
                f"{application_id}"
            ),
            headers=recruiter_headers,
            json={"status": "hired"},
        )
        self.assertEqual(invalid_transition_response.status_code, 409)

        match_response = self.client.post(
            "/api/me/job-matches/refresh",
            headers=candidate_headers,
            json={"resume_id": resume_id, "limit": 2},
        )
        self.assertEqual(match_response.status_code, 200)
        self.assertEqual(len(match_response.json()), 2)
        self.assertEqual(match_response.json()[0]["job"]["id"], str(self.job_id))

        profile_response = self.client.get(
            f"/api/users/{self.candidate_id}",
            headers=recruiter_headers,
        )
        self.assertEqual(profile_response.status_code, 200)

        repeated_profile_response = self.client.get(
            f"/api/users/{self.candidate_id}",
            headers=recruiter_headers,
        )
        self.assertEqual(repeated_profile_response.status_code, 200)

        profile_stats_response = self.client.get(
            "/api/me/profile-views",
            headers=candidate_headers,
        )
        self.assertEqual(profile_stats_response.status_code, 200)
        self.assertEqual(profile_stats_response.json()["unique_viewers"], 1)

        conversation_response = self.client.post(
            "/api/conversations",
            headers=candidate_headers,
            json={"participant_id": str(self.recruiter_id)},
        )
        self.assertEqual(conversation_response.status_code, 201)
        conversation_id = conversation_response.json()["id"]

        message_response = self.client.post(
            f"/api/conversations/{conversation_id}/messages",
            headers=candidate_headers,
            json={"body": "Hello, I have applied for the role."},
        )
        self.assertEqual(message_response.status_code, 201)

        recruiter_conversations = self.client.get(
            "/api/conversations",
            headers=recruiter_headers,
        )
        self.assertEqual(recruiter_conversations.status_code, 200)
        self.assertEqual(recruiter_conversations.json()[0]["unread_count"], 1)

        messages_response = self.client.get(
            f"/api/conversations/{conversation_id}/messages",
            headers=recruiter_headers,
        )
        self.assertEqual(messages_response.status_code, 200)
        self.assertEqual(len(messages_response.json()), 1)

        read_response = self.client.post(
            f"/api/conversations/{conversation_id}/read",
            headers=recruiter_headers,
        )
        self.assertEqual(read_response.status_code, 204)

        read_conversations_response = self.client.get(
            "/api/conversations",
            headers=recruiter_headers,
        )
        self.assertEqual(
            read_conversations_response.json()[0]["unread_count"],
            0,
        )


if __name__ == "__main__":
    unittest.main()
