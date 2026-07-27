# Bug Fix: Team Shortlisting Shows Non-Shortlisted Members

## Root Cause Analysis

1. **Backend `CompanySubmissionsView`** ignores the `shortlisted` query parameter - returns ALL submissions
2. **Frontend `CompanyDashboard.jsx`** doesn't filter by `item.shortlisted` before adding to shortlisted state

## Steps

- [x] 1. Find and analyze root cause
- [x] 2. Backend: Add `shortlisted` query param filtering in `submissions/views.py` - `CompanySubmissionsView`
- [x] 3. Frontend: Filter submissions by `shortlisted` property in `CompanyDashboard.jsx`
- [x] 4. Fix complete - both backend and frontend now properly handle shortlisted filtering
