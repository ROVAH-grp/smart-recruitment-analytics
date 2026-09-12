-- Smart Recruitment Analytics
-- Additive schema for the resume-upload feature.
-- Does NOT modify any existing table. Safe to run once against the
-- existing `smart_recruitment` database.
--
-- One resume per candidate. The actual file lives in Cloudinary;
-- only metadata and the asset URL are stored here.
CREATE TABLE IF NOT EXISTS resumes (
  resume_id BIGINT PRIMARY KEY AUTO_INCREMENT,
  candidate_id VARCHAR(50) NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INT NOT NULL,
  cloudinary_url VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT uq_resumes_candidate_id UNIQUE (candidate_id),
  CONSTRAINT fk_resumes_candidate
    FOREIGN KEY (candidate_id) REFERENCES candidates (candidate_id)
    ON DELETE CASCADE
);