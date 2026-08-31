export const candidates = [
  { id: "C001", name: "Aryan Mehta", email: "aryan.mehta@gmail.com", phone: "+91 98765 43210", location: "Bengaluru", experience: "4 yrs", education: "B.Tech CSE", skills: ["React", "Node.js", "TypeScript"], status: "shortlisted" },
  { id: "C002", name: "Priya Sharma", email: "priya.sharma@gmail.com", phone: "+91 97654 32109", location: "Mumbai", experience: "6 yrs", education: "MBA HR", skills: ["HR", "Recruitment", "ATS"], status: "joined" },
  { id: "C003", name: "Rohan Verma", email: "rohan.verma@outlook.com", phone: "+91 96543 21098", location: "Hyderabad", experience: "2 yrs", education: "B.Com", skills: ["Sales", "CRM", "Excel"], status: "offered" },
  { id: "C004", name: "Sneha Kapoor", email: "sneha.kapoor@gmail.com", phone: "+91 95432 10987", location: "Delhi", experience: "5 yrs", education: "M.Sc Data Science", skills: ["Python", "ML", "SQL"], status: "interviewed" },
  { id: "C005", name: "Vikram Singh", email: "vikram.singh@gmail.com", phone: "+91 94321 09876", location: "Pune", experience: "8 yrs", education: "B.Tech ECE", skills: ["Embedded", "C++", "IoT"], status: "selected" },
  { id: "C006", name: "Ananya Nair", email: "ananya.nair@gmail.com", phone: "+91 93210 98765", location: "Chennai", experience: "3 yrs", education: "B.Des", skills: ["Figma", "UI/UX", "Sketch"], status: "screened" },
  { id: "C007", name: "Karan Patel", email: "karan.patel@gmail.com", phone: "+91 92109 87654", location: "Ahmedabad", experience: "1 yr", education: "BBA", skills: ["Marketing", "SEO", "Content"], status: "applied" },
  { id: "C008", name: "Divya Reddy", email: "divya.reddy@gmail.com", phone: "+91 91098 76543", location: "Bengaluru", experience: "7 yrs", education: "CA", skills: ["Finance", "Taxation", "Audit"], status: "rejected" },
  { id: "C009", name: "Aditya Kumar", email: "aditya.kumar@gmail.com", phone: "+91 90987 65432", location: "Kolkata", experience: "4 yrs", education: "B.Tech Mech", skills: ["AutoCAD", "SolidWorks", "Six Sigma"], status: "joined" },
  { id: "C010", name: "Pooja Joshi", email: "pooja.joshi@gmail.com", phone: "+91 89876 54321", location: "Jaipur", experience: "2 yrs", education: "M.Com", skills: ["Accounting", "Tally", "GST"], status: "offered" },
];

export const jobs = [
  { id: "J001", title: "Senior Frontend Engineer", dept: "Engineering", location: "Bengaluru", type: "Full-time", openings: 3, applicants: 145, status: "open", postedDate: "2024-01-05", closingDate: "2024-03-05" },
  { id: "J002", title: "HR Business Partner", dept: "HR", location: "Mumbai", type: "Full-time", openings: 1, applicants: 62, status: "open", postedDate: "2024-01-10", closingDate: "2024-03-10" },
  { id: "J003", title: "Sales Executive", dept: "Sales", location: "Delhi", type: "Full-time", openings: 5, applicants: 190, status: "paused", postedDate: "2024-01-12", closingDate: "2024-03-12" },
  { id: "J004", title: "Data Scientist", dept: "Engineering", location: "Hyderabad", type: "Full-time", openings: 2, applicants: 98, status: "open", postedDate: "2024-01-15", closingDate: "2024-03-15" },
  { id: "J005", title: "UI/UX Designer", dept: "Design", location: "Bengaluru", type: "Full-time", openings: 2, applicants: 112, status: "open", postedDate: "2024-01-18", closingDate: "2024-03-18" },
  { id: "J006", title: "Finance Manager", dept: "Finance", location: "Mumbai", type: "Full-time", openings: 1, applicants: 74, status: "closed", postedDate: "2023-12-01", closingDate: "2024-01-31" },
  { id: "J007", title: "Digital Marketing Lead", dept: "Marketing", location: "Delhi", type: "Full-time", openings: 2, applicants: 88, status: "open", postedDate: "2024-01-20", closingDate: "2024-03-20" },
  { id: "J008", title: "Backend Engineer (Node.js)", dept: "Engineering", location: "Remote", type: "Full-time", openings: 4, applicants: 165, status: "open", postedDate: "2024-01-22", closingDate: "2024-03-22" },
];

export const applications = [
  { id: "APP001", candidate: "Aryan Mehta", candidateId: "C001", job: "Senior Frontend Engineer", jobId: "J001", recruiter: "Sarah Mitchell", source: "LinkedIn", status: "shortlisted", matchScore: 88, appliedDate: "2024-01-08", joiningDate: null, dept: "Engineering", interviewScore: 82, offerStatus: null, cost: 12000 },
  { id: "APP002", candidate: "Priya Sharma", candidateId: "C002", job: "HR Business Partner", jobId: "J002", recruiter: "James Watson", source: "Referral", status: "joined", matchScore: 92, appliedDate: "2024-01-11", joiningDate: "2024-03-01", dept: "HR", interviewScore: 90, offerStatus: "accepted", cost: 8500 },
  { id: "APP003", candidate: "Rohan Verma", candidateId: "C003", job: "Sales Executive", jobId: "J003", recruiter: "Emily Clarke", source: "Indeed", status: "offered", matchScore: 74, appliedDate: "2024-01-13", joiningDate: null, dept: "Sales", interviewScore: 76, offerStatus: "pending", cost: 6000 },
  { id: "APP004", candidate: "Sneha Kapoor", candidateId: "C004", job: "Data Scientist", jobId: "J004", recruiter: "Sarah Mitchell", source: "LinkedIn", status: "interviewed", matchScore: 86, appliedDate: "2024-01-16", joiningDate: null, dept: "Engineering", interviewScore: 79, offerStatus: null, cost: 15000 },
  { id: "APP005", candidate: "Vikram Singh", candidateId: "C005", job: "Backend Engineer (Node.js)", jobId: "J008", recruiter: "James Watson", source: "Naukri", status: "selected", matchScore: 91, appliedDate: "2024-01-23", joiningDate: null, dept: "Engineering", interviewScore: 88, offerStatus: null, cost: 18000 },
  { id: "APP006", candidate: "Ananya Nair", candidateId: "C006", job: "UI/UX Designer", jobId: "J005", recruiter: "Emily Clarke", source: "Company Website", status: "screened", matchScore: 80, appliedDate: "2024-01-19", joiningDate: null, dept: "Design", interviewScore: null, offerStatus: null, cost: 5000 },
  { id: "APP007", candidate: "Karan Patel", candidateId: "C007", job: "Digital Marketing Lead", jobId: "J007", recruiter: "Sarah Mitchell", source: "Indeed", status: "applied", matchScore: 65, appliedDate: "2024-01-21", joiningDate: null, dept: "Marketing", interviewScore: null, offerStatus: null, cost: 0 },
  { id: "APP008", candidate: "Divya Reddy", candidateId: "C008", job: "Finance Manager", jobId: "J006", recruiter: "James Watson", source: "LinkedIn", status: "rejected", matchScore: 58, appliedDate: "2023-12-10", joiningDate: null, dept: "Finance", interviewScore: 55, offerStatus: null, cost: 9000 },
  { id: "APP009", candidate: "Aditya Kumar", candidateId: "C009", job: "Backend Engineer (Node.js)", jobId: "J008", recruiter: "Emily Clarke", source: "Referral", status: "joined", matchScore: 84, appliedDate: "2024-01-25", joiningDate: "2024-03-15", dept: "Engineering", interviewScore: 87, offerStatus: "accepted", cost: 14000 },
  { id: "APP010", candidate: "Pooja Joshi", candidateId: "C010", job: "Finance Manager", jobId: "J006", recruiter: "Sarah Mitchell", source: "Naukri", status: "offered", matchScore: 77, appliedDate: "2023-12-15", joiningDate: null, dept: "Finance", interviewScore: 74, offerStatus: "pending", cost: 9500 },
];

export const recruiters = [
  { id: "R001", name: "Sarah Mitchell", email: "sarah.mitchell@company.com", phone: "+91 98765 11111", dept: "HR", assigned: 4, filled: 2, successRate: 50, avgTimeToHire: 16 },
  { id: "R002", name: "James Watson", email: "james.watson@company.com", phone: "+91 98765 22222", dept: "HR", assigned: 3, filled: 2, successRate: 67, avgTimeToHire: 19 },
  { id: "R003", name: "Emily Clarke", email: "emily.clarke@company.com", phone: "+91 98765 33333", dept: "HR", assigned: 3, filled: 1, successRate: 33, avgTimeToHire: 21 },
];

export const sources = [
  { id: "S001", name: "LinkedIn", applicants: 340, hired: 38, cost: 45000, cph: 1184 },
  { id: "S002", name: "Indeed", applicants: 220, hired: 22, cost: 18000, cph: 818 },
  { id: "S003", name: "Referral", applicants: 185, hired: 28, cost: 12000, cph: 429 },
  { id: "S004", name: "Company Website", applicants: 130, hired: 10, cost: 4000, cph: 400 },
  { id: "S005", name: "Naukri", applicants: 90, hired: 6, cost: 9000, cph: 1500 },
  { id: "S006", name: "Other", applicants: 35, hired: 0, cost: 2000, cph: 0 },
];

export const interviews = [
  { id: "I001", candidate: "Aryan Mehta", job: "Senior Frontend Engineer", recruiter: "Sarah Mitchell", type: "Technical", scheduledDate: "2024-02-10 10:00", score: 82, status: "completed", feedback: "Strong problem-solving skills, good React knowledge" },
  { id: "I002", candidate: "Sneha Kapoor", job: "Data Scientist", recruiter: "Sarah Mitchell", type: "Technical", scheduledDate: "2024-02-12 14:00", score: 79, status: "completed", feedback: "Good ML fundamentals, needs stronger SQL" },
  { id: "I003", candidate: "Rohan Verma", job: "Sales Executive", recruiter: "Emily Clarke", type: "HR", scheduledDate: "2024-02-14 11:00", score: 76, status: "completed", feedback: "Good communication, confident" },
  { id: "I004", candidate: "Vikram Singh", job: "Backend Engineer", recruiter: "James Watson", type: "Technical", scheduledDate: "2024-02-20 09:00", score: 88, status: "completed", feedback: "Excellent Node.js knowledge" },
  { id: "I005", candidate: "Ananya Nair", job: "UI/UX Designer", recruiter: "Emily Clarke", type: "Portfolio Review", scheduledDate: "2024-02-22 15:00", score: null, status: "scheduled", feedback: null },
  { id: "I006", candidate: "Karan Patel", job: "Digital Marketing Lead", recruiter: "Sarah Mitchell", type: "HR", scheduledDate: "2024-02-25 13:00", score: null, status: "scheduled", feedback: null },
];

export const offers = [
  { id: "O001", candidate: "Priya Sharma", job: "HR Business Partner", ctc: "18 LPA", offerDate: "2024-02-15", deadline: "2024-02-22", status: "accepted", joiningDate: "2024-03-01" },
  { id: "O002", candidate: "Rohan Verma", job: "Sales Executive", ctc: "8 LPA", offerDate: "2024-02-18", deadline: "2024-02-25", status: "pending", joiningDate: null },
  { id: "O003", candidate: "Aditya Kumar", job: "Backend Engineer (Node.js)", ctc: "22 LPA", offerDate: "2024-02-20", deadline: "2024-02-27", status: "accepted", joiningDate: "2024-03-15" },
  { id: "O004", candidate: "Pooja Joshi", job: "Finance Manager", ctc: "14 LPA", offerDate: "2024-02-22", deadline: "2024-03-01", status: "pending", joiningDate: null },
  { id: "O005", candidate: "Divya Reddy", job: "Finance Manager", ctc: "16 LPA", offerDate: "2024-01-20", deadline: "2024-01-27", status: "declined", joiningDate: null },
];

export const joiningRecords = [
  { id: "JR001", candidate: "Priya Sharma", job: "HR Business Partner", dept: "HR", joiningDate: "2024-03-01", empId: "EMP1042", status: "active", onboarding: "completed" },
  { id: "JR002", candidate: "Aditya Kumar", job: "Backend Engineer (Node.js)", dept: "Engineering", joiningDate: "2024-03-15", empId: "EMP1043", status: "active", onboarding: "in_progress" },
];
