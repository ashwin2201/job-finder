BEGIN;

CREATE TABLE IF NOT EXISTS user_resumes (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT ck_user_resumes_status
        CHECK (status IN ('active', 'archived'))
);

CREATE INDEX IF NOT EXISTS ix_user_resumes_user_id
    ON user_resumes (user_id);
CREATE INDEX IF NOT EXISTS ix_user_resumes_status
    ON user_resumes (status);
CREATE INDEX IF NOT EXISTS ix_user_resumes_is_primary
    ON user_resumes (is_primary);
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_resumes_active_primary
    ON user_resumes (user_id)
    WHERE is_primary AND status = 'active';

CREATE TABLE IF NOT EXISTS resume_feedback (
    id UUID PRIMARY KEY,
    resume_id UUID NOT NULL REFERENCES user_resumes(id) ON DELETE CASCADE,
    source VARCHAR(32) NOT NULL DEFAULT 'system',
    summary TEXT NOT NULL,
    strengths TEXT,
    improvements TEXT,
    score INTEGER,
    created_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT ck_resume_feedback_score
        CHECK (score IS NULL OR (score >= 0 AND score <= 100))
);

CREATE INDEX IF NOT EXISTS ix_resume_feedback_resume_id
    ON resume_feedback (resume_id);
CREATE INDEX IF NOT EXISTS ix_resume_feedback_source
    ON resume_feedback (source);

CREATE TABLE IF NOT EXISTS saved_jobs (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, job_id)
);

CREATE INDEX IF NOT EXISTS ix_saved_jobs_job_id
    ON saved_jobs (job_id);

CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY,
    applicant_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE RESTRICT,
    resume_id UUID REFERENCES user_resumes(id) ON DELETE SET NULL,
    cover_letter TEXT,
    status VARCHAR(32) NOT NULL DEFAULT 'submitted',
    employer_note TEXT,
    applied_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT uq_job_applications_applicant_job
        UNIQUE (applicant_id, job_id),
    CONSTRAINT ck_job_applications_status
        CHECK (
            status IN (
                'submitted',
                'reviewing',
                'interview',
                'offer',
                'hired',
                'rejected',
                'withdrawn'
            )
        )
);

CREATE INDEX IF NOT EXISTS ix_job_applications_applicant_id
    ON job_applications (applicant_id);
CREATE INDEX IF NOT EXISTS ix_job_applications_job_id
    ON job_applications (job_id);
CREATE INDEX IF NOT EXISTS ix_job_applications_status
    ON job_applications (status);

CREATE TABLE IF NOT EXISTS job_matches (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    resume_id UUID REFERENCES user_resumes(id) ON DELETE SET NULL,
    score DOUBLE PRECISION NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (user_id, job_id),
    CONSTRAINT ck_job_matches_score CHECK (score >= 0 AND score <= 1)
);

CREATE INDEX IF NOT EXISTS ix_job_matches_score
    ON job_matches (score);
CREATE INDEX IF NOT EXISTS ix_job_matches_job_id
    ON job_matches (job_id);

CREATE TABLE IF NOT EXISTS profile_views (
    id UUID PRIMARY KEY,
    viewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS ix_profile_views_viewed_user_id
    ON profile_views (viewed_user_id);
CREATE INDEX IF NOT EXISTS ix_profile_views_viewer_user_id
    ON profile_views (viewer_user_id);
CREATE INDEX IF NOT EXISTS ix_profile_views_viewed_at
    ON profile_views (viewed_at);

CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY,
    kind VARCHAR(32) NOT NULL DEFAULT 'direct',
    direct_key VARCHAR(73),
    subject VARCHAR(200),
    created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_conversations_direct_key
    ON conversations (direct_key);
CREATE INDEX IF NOT EXISTS ix_conversations_kind
    ON conversations (kind);

CREATE TABLE IF NOT EXISTS conversation_participants (
    conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL,
    last_read_at TIMESTAMPTZ,
    left_at TIMESTAMPTZ,
    PRIMARY KEY (conversation_id, user_id)
);

CREATE INDEX IF NOT EXISTS ix_conversation_participants_user_id
    ON conversation_participants (user_id);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY,
    conversation_id UUID NOT NULL
        REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    edited_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS ix_messages_conversation_id
    ON messages (conversation_id);
CREATE INDEX IF NOT EXISTS ix_messages_sender_id
    ON messages (sender_id);
CREATE INDEX IF NOT EXISTS ix_messages_conversation_created_at
    ON messages (conversation_id, created_at DESC);

COMMIT;
