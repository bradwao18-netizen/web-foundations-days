# SnapShare — System Scaling Plan

## 1. Assumptions and Daily Active Users (DAU)
* **Total Registered Users:** 10,000,000
* **Activity Rate:** 10% of registered users active per day
* **User Actions:** 
  * Each active user uploads **1 photo per day**.
  * Each active user views **50 feed pages per day**.
* **File Sizes:** 
  * Average photo size = **2 MB**
  * Thumbnail size = **50 KB** (0.05 MB)

### Daily Active Users (DAU):
$$\text{DAU} = 10,000,000 \times 10\% = 1,000,000 \text{ active users/day}$$

---

## 2. Traffic and Storage Calculations

### A. Uploads Per Second
* **Total Daily Uploads:** $1,000,000 \text{ users} \times 1 \text{ photo/day} = 1,000,000 \text{ uploads/day}$
* **Average Uploads/sec:** $\frac{1,000,000}{86,400 \text{ seconds}} \approx \mathbf{11.57 \text{ uploads/sec}}$
* **Peak Uploads/sec ($5\times$ multiplier):** $11.57 \times 5 = \mathbf{57.87 \text{ uploads/sec}}$

### B. Feed Views Per Second
* **Total Daily Feed Views:** $1,000,000 \text{ users} \times 50 \text{ feeds/day} = 50,000,000 \text{ feed views/day}$
* **Average Feed Views/sec:** $\frac{50,000,000}{86,400 \text{ seconds}} \approx \mathbf{578.70 \text{ views/sec}}$
* **Peak Feed Views/sec ($5\times$ multiplier):** $578.70 \times 5 = \mathbf{2,893.50 \text{ views/sec}}$

### C. Photo Storage Per Year
* **Storage per Photo (Photo + Thumbnail):** $2 \text{ MB} + 0.05 \text{ MB} = 2.05 \text{ MB}$
* **Daily Storage:** $1,000,000 \times 2.05 \text{ MB} = 2,050,000 \text{ MB/day} = 2.05 \text{ TB/day}$
* **Yearly Storage:** $2.05 \text{ TB/day} \times 365 \text{ days} \approx \mathbf{748.25 \text{ TB/year}}$

---

## 3. Read-Heavy vs. Write-Heavy System
* **Classification:** Read-Heavy
* **Explanation:** The system receives **50,000,000 feed views** per day compared to **1,000,000 photo uploads** per day (a 50:1 read-to-write ratio). For the design, this means we must optimize for high read throughput using caching layers, read replicas, and content delivery networks.

---

## 4. Why Photos Are Not Stored in the Database
* **Explanation:** Relational databases are designed for structured tabular data and ACID transactions, making direct storage of large binary files (BLOBs) inefficient, expensive, and detrimental to database query speed and backup operations.
* **Storage Solution:** Raw photos and thumbnails should be stored in dedicated **Object Storage** (e.g., AWS S3), while the database only stores metadata like file URLs, timestamps, and user IDs.

---

## 5. Architecture Diagram

```text
[Client / Mobile App]
        │
        ▼
   [CDN (Cloudflare/CloudFront)] ── (Serves cached photos & thumbnails)
        │
        ▼
   [Load Balancer (Nginx / HAProxy)]
        │
        ├──────────────────────────┐
        ▼                          ▼
 [App Server 1]             [App Server 2]
        │                          │
        ├───────────┬──────────────┘
        ▼           ▼
   [Redis Cache]  [Message Queue (RabbitMQ / SQS)]
        │           │
        │           ▼
        │      [Thumbnail Worker]
        │           │
        ▼           ▼
  [Primary DB] ──► [Read Replica]     [Object Storage (S3)]
 (Metadata Write)   (Metadata Read)    (Raw