-- ==============================================================================
-- GOATFARM OS — AI HEALTH & MULTIMODAL INTELLIGENCE SCHEMA (ADDITIVE LAYER)
-- PostgreSQL 14+ / Supabase / Neon Compatible
-- Does not modify or drop any core tables.
-- ==============================================================================

-- 1. Camera Infrastructure & Streams (IP / RTSP / ONVIF)
CREATE TABLE IF NOT EXISTS cameras (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    name VARCHAR(100) NOT NULL,
    rtsp_url TEXT NOT NULL,
    gateway_ip VARCHAR(50),
    fps_sample_rate INT DEFAULT 5,
    resolution VARCHAR(30) DEFAULT '1080p',
    status VARCHAR(30) DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'OFFLINE', 'DEGRADED', 'MAINTENANCE')),
    detection_enabled BOOLEAN DEFAULT TRUE,
    last_ping TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Camera Ingested Events (Sampled Frames & Re-ID)
CREATE TABLE IF NOT EXISTS camera_events (
    id VARCHAR(64) PRIMARY KEY,
    camera_id VARCHAR(64) REFERENCES cameras(id) ON DELETE CASCADE,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('MOTION', 'DEFECATION', 'FEEDING', 'DRINKING', 'GAIT_TRACK', 'POSTURE_ALERT', 'ZONE_ENTRY')),
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE SET NULL,
    identification_confidence NUMERIC(4, 3) DEFAULT 0.000,
    is_unknown_goat BOOLEAN DEFAULT FALSE,
    snapshot_url TEXT,
    bounding_box JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Individual Goat Behavior Events
CREATE TABLE IF NOT EXISTS goat_behavior_events (
    id VARCHAR(64) PRIMARY KEY,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE CASCADE,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    behavior_type VARCHAR(50) NOT NULL CHECK (behavior_type IN (
        'WALKING', 'STANDING', 'LYING', 'RESTING', 'EATING', 'DRINKING',
        'GROOMING', 'SCRATCHING', 'ISOLATION', 'AGGRESSION', 'ABNORMAL_INACTIVITY', 'ABNORMAL_MOVEMENT'
    )),
    duration_seconds INT DEFAULT 0,
    confidence NUMERIC(4, 3) DEFAULT 0.850,
    baseline_deviation_score NUMERIC(5, 2) DEFAULT 0.00,
    camera_id VARCHAR(64) REFERENCES cameras(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Feces Visual Category Observations
CREATE TABLE IF NOT EXISTS feces_observations (
    id VARCHAR(64) PRIMARY KEY,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE SET NULL,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visual_category VARCHAR(50) NOT NULL CHECK (visual_category IN (
        'NORMAL', 'SOFT', 'WATERY', 'DIARRHEA_LIKE', 'UNUSUAL_APPEARANCE', 'MUCUS_LIKE', 'BLOOD_LIKE', 'UNKNOWN'
    )),
    confidence NUMERIC(4, 3) DEFAULT 0.900,
    image_crop_url TEXT,
    quality_passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. IoT Environmental Readings (Shed Sensors)
CREATE TABLE IF NOT EXISTS environment_readings (
    id VARCHAR(64) PRIMARY KEY,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    temperature_celsius NUMERIC(5, 2) NOT NULL,
    relative_humidity_pct NUMERIC(5, 2) NOT NULL,
    ammonia_ppm NUMERIC(6, 2) DEFAULT 0.00,
    co2_ppm NUMERIC(8, 2) DEFAULT 400.00,
    air_quality_index INT DEFAULT 50,
    water_trough_liters NUMERIC(8, 2) DEFAULT 100.00,
    feed_trough_kg NUMERIC(8, 2) DEFAULT 50.00,
    heat_stress_index VARCHAR(20) DEFAULT 'COMFORT',
    sensor_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. AI Observations Master Registry
CREATE TABLE IF NOT EXISTS ai_observations (
    id VARCHAR(64) PRIMARY KEY,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE CASCADE,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    detection_method VARCHAR(50) NOT NULL CHECK (detection_method IN (
        'BEHAVIOR', 'FECES', 'GAIT', 'POSTURE', 'EYE', 'NOSE_MOUTH', 'SKIN_HAIR',
        'BODY_CONDITION', 'WEIGHT_GROWTH', 'FEEDING_DRINKING', 'RESPIRATORY', 'ENVIRONMENT', 'GROUP_ANOMALY', 'HISTORICAL_RISK'
    )),
    finding_summary TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'INFO' CHECK (severity IN ('INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    confidence NUMERIC(4, 3) NOT NULL,
    model_version VARCHAR(50) NOT NULL,
    top_contributing_factors JSONB,
    evidence_snapshot_url TEXT,
    safety_disclaimer TEXT DEFAULT 'Possible abnormality detected. Veterinary examination recommended.',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Multimodal Health Risk Scores
CREATE TABLE IF NOT EXISTS health_risk_scores (
    id VARCHAR(64) PRIMARY KEY,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE CASCADE,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    composite_score NUMERIC(5, 2) NOT NULL, -- 0 to 100
    behavior_subscore NUMERIC(5, 2) DEFAULT 0.00,
    growth_subscore NUMERIC(5, 2) DEFAULT 0.00,
    appearance_subscore NUMERIC(5, 2) DEFAULT 0.00,
    feces_subscore NUMERIC(5, 2) DEFAULT 0.00,
    environment_subscore NUMERIC(5, 2) DEFAULT 0.00,
    top_contributing_observations JSONB,
    baseline_window VARCHAR(20) DEFAULT '14_DAY',
    recommended_action TEXT,
    vet_review_status VARCHAR(30) DEFAULT 'PENDING' CHECK (vet_review_status IN ('PENDING', 'CONFIRMED', 'REJECTED', 'NEEDS_INVESTIGATION')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Actionable Health Alerts
CREATE TABLE IF NOT EXISTS health_alerts (
    id VARCHAR(64) PRIMARY KEY,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE CASCADE,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    pen_id VARCHAR(64) REFERENCES pens(id) ON DELETE SET NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    contributing_modules JSONB,
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'DISMISSED')),
    deduplication_key VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(100),
    CONSTRAINT uq_health_alert_dedup UNIQUE (deduplication_key, status)
);

-- 9. Veterinarian Clinical Review & Outcomes
CREATE TABLE IF NOT EXISTS vet_reviews (
    id VARCHAR(64) PRIMARY KEY,
    alert_id VARCHAR(64) REFERENCES health_alerts(id) ON DELETE SET NULL,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE CASCADE,
    vet_name VARCHAR(255) NOT NULL,
    review_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    review_status VARCHAR(30) NOT NULL CHECK (review_status IN ('CONFIRMED', 'REJECTED', 'NEEDS_INVESTIGATION')),
    clinical_observation TEXT NOT NULL,
    formal_diagnosis VARCHAR(255),
    prescribed_treatment TEXT,
    medicine_administered VARCHAR(255),
    dosage VARCHAR(100),
    followup_date DATE,
    treatment_outcome VARCHAR(50) CHECK (treatment_outcome IN ('RECOVERED', 'IMPROVING', 'UNCHANGED', 'DETERIORATED', 'CULLED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. AI Model Registry & Continuous Learning
CREATE TABLE IF NOT EXISTS ai_models (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    task VARCHAR(100) NOT NULL,
    architecture VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ai_model_versions (
    id VARCHAR(64) PRIMARY KEY,
    model_id VARCHAR(64) REFERENCES ai_models(id) ON DELETE CASCADE,
    version_tag VARCHAR(50) NOT NULL,
    precision_score NUMERIC(5, 4),
    recall_score NUMERIC(5, 4),
    f1_score NUMERIC(5, 4),
    sensitivity NUMERIC(5, 4),
    specificity NUMERIC(5, 4),
    status VARCHAR(30) DEFAULT 'STAGING' CHECK (status IN ('TRAINING', 'STAGING', 'PRODUCTION', 'ARCHIVED')),
    deployed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS training_samples (
    id VARCHAR(64) PRIMARY KEY,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE SET NULL,
    farm_id VARCHAR(64) REFERENCES farms(id) ON DELETE CASCADE,
    sample_type VARCHAR(50) NOT NULL,
    image_url TEXT,
    telemetry_data JSONB,
    ground_truth_label VARCHAR(100) NOT NULL,
    vet_verified BOOLEAN DEFAULT TRUE,
    dataset_split VARCHAR(20) DEFAULT 'TRAIN' CHECK (dataset_split IN ('TRAIN', 'VAL', 'TEST')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dataset_versions (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    version VARCHAR(30) NOT NULL,
    sample_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS model_predictions (
    id VARCHAR(64) PRIMARY KEY,
    model_version_id VARCHAR(64) REFERENCES ai_model_versions(id) ON DELETE CASCADE,
    goat_id VARCHAR(64) REFERENCES goats(id) ON DELETE CASCADE,
    input_source VARCHAR(100) NOT NULL,
    prediction_result JSONB NOT NULL,
    confidence NUMERIC(4, 3) NOT NULL,
    inference_duration_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- ADDITIVE INDEXES FOR HIGH-THROUGHPUT REALTIME INFERENCE & EVENT QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_ai_obs_goat_time ON ai_observations(goat_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_obs_method ON ai_observations(detection_method);
CREATE INDEX IF NOT EXISTS idx_health_alerts_goat_status ON health_alerts(goat_id, status);
CREATE INDEX IF NOT EXISTS idx_health_risk_goat ON health_risk_scores(goat_id, calculated_at DESC);
CREATE INDEX IF NOT EXISTS idx_camera_events_cam_time ON camera_events(camera_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_feces_obs_goat ON feces_observations(goat_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_env_readings_pen_time ON environment_readings(pen_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vet_reviews_goat ON vet_reviews(goat_id, review_timestamp DESC);
