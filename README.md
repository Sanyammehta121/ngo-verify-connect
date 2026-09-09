# 🛡️ NGO Verify & Connect

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSanyammehta121%2Fngo-verify-connect)

**NGO Verify & Connect** is a full-stack public transparency, verification, and due-diligence platform designed to help citizens, donors, and volunteers independently cross-examine, verify, and trust local non-profit organizations (NGOs) before donating or volunteering.

---

## 🌟 Key Features & Functional Modules

### 1. 🔍 NGO Finder & Autocomplete Search
- **Instant Search with Autocomplete**: Real-time debounce autocomplete matching NGO Name (e.g. *Goonj*, *Pratham*), City (*Mumbai*, *Delhi*, *Bengaluru*), or Cause Area (*Education*, *Disaster Relief*).
- **Multi-Parameter Filtering**:
  - **Location**: Region & City selector (Delhi, Mumbai, Bengaluru, Pune, or All India).
  - **Category**: Multi-select cause checkboxes (Education, Health & Nutrition, Disaster Relief, Elderly Care, Animal Welfare, Women Empowerment, etc.).
  - **Verification Status**: Filter by `All`, `Verified Only`, or `Pending Review`.
  - **Minimum Trust Rating**: Filter by `Any`, `★ 3.5+`, or `★ 4.5+`.
- **Sorting Options**: Highest Trust Rating, Most Reviewed, Recently Verified, or Alphabetical (A-Z).
- **Card-Based Results Grid**: Displays logo, trust meter, verified badges, statutory 12A/80G/Darpan quick indicators, and donation safety status.

### 2. 🏛️ Government Document Checker
- Dedicated statutory compliance desk for every NGO profile displaying:
  - **NITI Aayog NGO Darpan ID** (e.g., `DL/2009/0002131`) with direct search links out to official registry `https://ngodarpan.gov.in`.
  - **Section 12A Charitable Exemption** status (Form 10AC).
  - **Section 80G Donor Tax Benefit** status (50% income tax deduction).
  - **FCRA Registration Clearance** (Foreign Contribution Regulation Act) with registration numbers.
  - **Society / Trust Registration Number** (Societies Act XXI / Bombay Public Trusts Act, 1950) & PAN.
- **Status Badges**: `Verified & Active` (Emerald), `Under Review` (Amber), `Expired Renewal` (Rose), `Unverified` (Gray).
- **"Last verified on [date]" Timestamp**: Prominently displayed on every record.
- **Officer Override Desk**: Admin users can modify document statuses inline and recalculate composite trust scores in real time.

### 3. 📍 Local NGO Listings & Interactive Map
- **Dynamic Trust Meter**: Calculated composite score (1.0 to 5.0 stars and 0–100% integrity rating).
- **Certifications Roster**: Table of statutory certificates detailing issuing authority, issue date, expiry date, and status.
- **Interactive OpenStreetMap Embed**: Displays registered coordinates, marker pin, address details, and 1-click Google Maps directions.

### 4. 📞 Contact Information & Click-to-Call
- Phone numbers with instant **Click-to-Call** button (`tel:+91...`) optimized for mobile donors.
- Direct click-to-email and verified official website links with external indicators.

### 5. 💳 Transaction & Verified Donation Link
- **Verified Payment Channel**: Secure button linking directly to the NGO's official SSL gateway or bank account, plus copyable UPI VPA (e.g. `goonj@icici`).
- **Caution Warning Banner**: Prominent caution banner for unverified entities (*"Donate with Caution: No verified institutional payment channel on file. Never send funds to personal UPI handles"*).

### 6. ⭐ User Feedback & Whistleblower System
- **Star Rating & Written Review Submission**: Authenticated submission for verified donors and volunteers.
- **Dynamic Score Recalculation**: Submitting reviews dynamically updates the NGO's trust rating.
- **Whistleblower Fraud Reporting**: Public form to report irregularities (fund diversion, fake receipts, unauthorized UPI handles), generating unique tracking tickets (e.g. `REP-2026-0001`).
- **Admin Moderation Desk**: Officers can approve or reject reviews and triage fraud reports.

### 7. 🤝 Public Crowdsourcing ("Suggest an NGO")
- Public submission intake modal to propose real grassroots NGOs.
- Admin dashboard tab allows officers to review proposals and 1-click approve them into the active directory.

### 8. 📐 Trust Score Methodology Page
- Transparent breakdown of the 7-pillar mathematical formula:
  - 12A Charitable Exemption: **20%**
  - 80G Tax Exemption: **20%**
  - NGO Darpan ID: **20%**
  - FCRA Clearance: **10%**
  - Verified Payment Gateway: **10%**
  - Audit Freshness (<12 Months): **10%**
  - Community Donor Reviews: **10%**
- Guide on manually checking government registries (NGO Darpan, Income Tax, MHA FCRA).
- 5 Philanthropic Red Flags every donor must look out for.

---

## 📦 Real Seed Dataset (Verifiable Public Records)

The database is seeded with authentic Indian non-profit organizations cross-referenced against public archives:

| NGO Name | City & State | Darpan ID | 12A | 80G | FCRA | Registration Act |
| :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| **Goonj** | New Delhi, DL | `DL/2009/0002131` | Verified | Verified | Verified | S-34346 of 1999 (Societies Act XXI) |
| **Pratham Education Foundation** | Mumbai, MH | `MH/2010/0034444` | Verified | Verified | Verified | E-18012 (Bombay Public Trusts Act) |
| **The Akshaya Patra Foundation** | Bengaluru, KA | `KA/2010/0034177` | Verified | Verified | Verified | 416/2001-02 (Registered Trust) |
| **HelpAge India** | New Delhi, DL | `DL/2009/0014238` | Verified | Verified | Verified | S-9404 of 1978 (Societies Act) |
| **CRY - Child Rights and You** | Mumbai, MH | `MH/2009/0002165` | Verified | Verified | Verified | 801/1979 (Public Charitable Trust) |
| **Smile Foundation** | New Delhi, DL | `DL/2010/0034876` | Verified | Verified | Verified | S-42171 of 2002 |
| **Wildlife SOS** | New Delhi, DL | `DL/2017/0158492` | Verified | Verified | Verified | 588/1995 (Society under Act XXI) |
| **Give Foundation (GiveIndia)** | Bengaluru, KA | `KA/2016/0107293` | Verified | Verified | Verified | E-18579 (Mumbai Public Trust) |
| **Jan Kalyan Samajik Sanstha** | Pune, MH | *None* | Pending | Pending | None | *Under Review (Demo Caution State)* |

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Tailwind CSS v4, Lucide React Icons, OpenStreetMap
- **Backend**: Node.js 24 LTS, Express, JWT, BcryptJS, CORS
- **Database**: Node 24 native SQLite (`node:sqlite`) with ACID transactions, indexing, and persistent file storage at `backend/data/ngo_database.sqlite` (zero external daemon or Docker required)
- **Tooling**: Vite 8, NPM 11

---

## 🚀 Quick Start Guide

### 1. Launch the Application
Run via PowerShell:
```powershell
.\run.ps1
```
Or via Node:
```powershell
node backend/src/server.js
```
The full application (React frontend + Express API) will be live at:
👉 **[http://localhost:5000](http://localhost:5000)**

### 2. Demo User Credentials (1-Click Login available in UI)
- **Verified Donor (Citizen)**:
  - Email: `citizen@example.com`
  - Password: `User@123`
  - *Or click "⚡ Verified Donor" in the login modal*
- **Verification Officer (Admin)**:
  - Email: `admin@ngoverify.org`
  - Password: `Admin@123`
  - *Or click "⚡ Admin Desk" in the login modal*

### 3. Run Automated Tests
```powershell
node backend/src/test-api.js
```
Executes all 11 automated verification scenarios across authentication, discovery, document updates, dynamic scoring, and whistleblower reporting.

### 4. Re-import Seed Data
```powershell
node backend/src/import-seed.js
```
Populates or resets the database from `backend/data/real_ngos_seed.json`.
