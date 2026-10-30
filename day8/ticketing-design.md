# TicketHub - Event Ticketing System Architecture Design

## 1. Requirements

### Functional Requirements
* **Event Discovery & Browsing:** Users can search and view upcoming concerts, sports events, and festivals, filtered by category, date, and location.
* **Real-Time Seat Selection:** Users can view a seating layout map, check real-time seat availability, and temporarily lock/hold specific seats.
* **Checkout & Secure Payment:** Users can process payments securely to convert their temporary seat holds into confirmed ticket orders.
* **Ticket Management:** Users can access and view their purchased tickets containing unique confirmation codes/QR codes.

### Non-Functional Requirements
* **Correctness:** Zero tolerance for double-booking. Two users must never successfully purchase the exact same seat[span_1](start_span)[span_1](end_span).
* **Fairness:** Tickets are allocated strictly on a first-come, first-served basis. Temporary holds must automatically expire (e.g., after 10 minutes) if payment is incomplete, releasing seats back to the public pool.
* **Speed & Latency:** High-speed response times for seat selection maps, keeping checkout flows smooth even under heavy loads.

---

## 2. Traffic Estimates

### Baseline Metrics & Normal Traffic
* **Registered Users:** 2,000,000 users[span_2](start_span)[span_2](end_span).
* **Normal Day Visitors:** 50,000 daily visitors, with each user viewing an average of 10 pages[span_3](start_span)[span_3](end_span).
* **Normal Day Page Views:** $50,000 \times 10 = 500,000$ page views/day.
* **Normal Day Sales:** 5,000 tickets sold on a normal day[span_4](start_span)[span_4](end_span).
* **Normal RPS (Requests Per Second):** $\approx 5.8$ RPS average, with minor peaks up to 20 RPS.

### "Big Sale" Peak Traffic
* **Scenario:** A popular concert goes on sale, attracting **200,000 concurrent users** trying to buy **20,000 seats within the first 10 minutes** (600 seconds)[span_5](start_span)[span_5](end_span).
* **Peak Request Rate:** $\approx 333$ incoming requests per second for browsing/queuing, coupled with high-concurrency write locks on the seat inventory tables.
* **Comparison:** Peak event traffic multiplies normal visitor loads by over 50x, highly concentrated on a single event page and its associated seating inventory database.

---

## 3. API Endpoints

1. **`GET /api/events`**
   * *Description:* Browse and filter available concerts and events.
2. **`GET /api/events/{eventId}/seats`**
   * *Description:* Fetch the real-time seat map and status (available, held, booked) for a specific event.
3. **`POST /api/seats/hold`**
   * *Description:* Temporarily lock selected seats for a user for 10 minutes during checkout.
4. **`POST /api/orders/checkout`**
   * *Description:* Process payment and confirm the order, converting held seats into permanently booked seats.
5. **`GET /api/users/{userId}/tickets`**
   * *Description:* Retrieve all active confirmed tickets belonging to a specific user.

---

## 4. Data Model (Relational Schema)

### Tables & Relationships
1. **`users`**
   * `user_id` (PK), `email`, `password_hash`, `created_at`
2. **`events`**
   * `event_id` (PK), `title`, `description`, `date`, `venue_location`, `total_seats`
3. **`seats`**
   * `seat_id` (PK), `event_id` (FK to `events`), `seat_number`, `status` (`available`, `held`, `booked`), `held_until` (timestamp)
4. **`orders`**
   * `order_id` (PK), `user_id` (FK to `users`), `event_id` (FK to `events`), `total_amount`, `payment_status`, `created_at`

*Relationships:* One event has many seats and orders; one user has many orders; one order maps to multiple booked seats.

---

## 5. Preventing Double-Booking

To ensure two people never buy the same seat, the system utilizes **ACID database transactions combined with pessimistic row-level locking (`SELECT ... FOR UPDATE`)**:
* When a user attempts to hold a seat, the transaction initiates a row lock on the specific `seat` record.
* The system checks if `status == 'available'` (or if an existing hold has expired where `held_until < NOW()`).
* If valid, the status updates to `held`, sets a `held_until` timestamp 10 minutes in the future, and commits the transaction. Other concurrent requests attempting to lock that exact seat row are blocked until the transaction completes, preventing simultaneous double-allocation.

---

## 6. System Architecture & Big Sale Survival

### Architecture Components
* **Global CDN & Load Balancer:** Distributes incoming user traffic across multiple application server instances.
* **Virtual Waiting Room / Queue Service:** During big sales, excess users are placed into a virtual queue (e.g., Redis-backed token bucket) to throttle traffic entering the booking service, protecting the database from collapse.
* **Application Servers (Stateless API):** Handle business logic, seat locking requests, and checkout orchestration.
* **Redis Cache Layer:** Caches event details and quick-check seat availability statuses to reduce direct database reads.
* **PostgreSQL Database Cluster:** Manages durable transactional states, ACID compliance, and seat reservations with read-replicas for browsing traffic.

---

## 7. Design Trade-offs

1. **Strict Consistency vs. High Availability (CP over AP):** 
   * *Trade-off:* We prioritized strict consistency for seat inventory over raw availability. During high-concurrency sales, users might experience queues or slower responses, but we completely eliminate the risk of overselling tickets.
2. **Pessimistic Locking vs. Optimistic Concurrency Control:**
   * *Trade-off:* Using row-level database locks during the hold phase introduces brief transaction queuing during peak bursts, but it guarantees absolute correctness and prevents race conditions compared to optimistic validation checks.