-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: smart_recruitment
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `application_id` bigint NOT NULL AUTO_INCREMENT,
  `candidate_id` varchar(50) NOT NULL,
  `job_id` varchar(50) NOT NULL,
  `recruiter_id` int DEFAULT NULL,
  `source_id` int DEFAULT NULL,
  `application_date` date DEFAULT NULL,
  `screening_date` date DEFAULT NULL,
  `shortlist_date` date DEFAULT NULL,
  `interview_date` date DEFAULT NULL,
  `selection_date` date DEFAULT NULL,
  `offer_date` date DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `match_score` decimal(5,2) DEFAULT NULL,
  `recruitment_cost` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`application_id`),
  UNIQUE KEY `uq_application_candidate_job` (`candidate_id`,`job_id`),
  KEY `idx_applications_candidate` (`candidate_id`),
  KEY `idx_applications_job` (`job_id`),
  KEY `idx_applications_recruiter` (`recruiter_id`),
  KEY `idx_applications_source` (`source_id`),
  KEY `idx_applications_status` (`status`),
  KEY `idx_applications_application_date` (`application_date`),
  KEY `idx_applications_joining_date` (`joining_date`),
  CONSTRAINT `fk_application_candidate` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`candidate_id`),
  CONSTRAINT `fk_application_job` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`job_id`),
  CONSTRAINT `fk_application_recruiter` FOREIGN KEY (`recruiter_id`) REFERENCES `recruiters` (`recruiter_id`),
  CONSTRAINT `fk_application_source` FOREIGN KEY (`source_id`) REFERENCES `sources` (`source_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3047 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `candidates`
--

DROP TABLE IF EXISTS `candidates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidates` (
  `candidate_id` varchar(50) NOT NULL,
  `candidate_name` varchar(150) NOT NULL,
  `experience_years` decimal(4,1) DEFAULT NULL,
  `education` varchar(150) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidates`
--

LOCK TABLES `candidates` WRITE;
/*!40000 ALTER TABLE `candidates` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `interviews`
--

DROP TABLE IF EXISTS `interviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `interviews` (
  `interview_id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `interview_date` date DEFAULT NULL,
  `technical_score` decimal(5,2) DEFAULT NULL,
  `communication_score` decimal(5,2) DEFAULT NULL,
  `problem_solving_score` decimal(5,2) DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`interview_id`),
  UNIQUE KEY `application_id` (`application_id`),
  CONSTRAINT `fk_interview_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1025 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `interviews`
--

LOCK TABLES `interviews` WRITE;
/*!40000 ALTER TABLE `interviews` DISABLE KEYS */;
/*!40000 ALTER TABLE `interviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `job_id` varchar(50) NOT NULL,
  `job_title` varchar(150) NOT NULL,
  `department` varchar(100) DEFAULT NULL,
  `job_posted_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`job_id`),
  KEY `idx_applications_department_job` (`department`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `joining_records`
--

DROP TABLE IF EXISTS `joining_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `joining_records` (
  `joining_id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `joining_date` date DEFAULT NULL,
  `joining_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`joining_id`),
  UNIQUE KEY `application_id` (`application_id`),
  CONSTRAINT `fk_joining_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `joining_records`
--

LOCK TABLES `joining_records` WRITE;
/*!40000 ALTER TABLE `joining_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `joining_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offers`
--

DROP TABLE IF EXISTS `offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offers` (
  `offer_id` bigint NOT NULL AUTO_INCREMENT,
  `application_id` bigint NOT NULL,
  `offer_date` date DEFAULT NULL,
  `offer_status` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`offer_id`),
  UNIQUE KEY `application_id` (`application_id`),
  CONSTRAINT `fk_offer_application` FOREIGN KEY (`application_id`) REFERENCES `applications` (`application_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offers`
--

LOCK TABLES `offers` WRITE;
/*!40000 ALTER TABLE `offers` DISABLE KEYS */;
/*!40000 ALTER TABLE `offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recruiters`
--

DROP TABLE IF EXISTS `recruiters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recruiters` (
  `recruiter_id` int NOT NULL AUTO_INCREMENT,
  `recruiter_name` varchar(150) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`recruiter_id`),
  UNIQUE KEY `recruiter_name` (`recruiter_name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recruiters`
--

LOCK TABLES `recruiters` WRITE;
/*!40000 ALTER TABLE `recruiters` DISABLE KEYS */;
/*!40000 ALTER TABLE `recruiters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sources`
--

DROP TABLE IF EXISTS `sources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sources` (
  `source_id` int NOT NULL AUTO_INCREMENT,
  `source_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`source_id`),
  UNIQUE KEY `source_name` (`source_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sources`
--

LOCK TABLES `sources` WRITE;
/*!40000 ALTER TABLE `sources` DISABLE KEYS */;
/*!40000 ALTER TABLE `sources` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-31 21:05:02
