# TODO: Replace Mock Profile Pictures with Real Profile Pictures

## Backend

- [x] Update SubmissionSerializer to expose `submitter` object with profile_picture
- [x] Add `submitter_profile_picture` field for direct avatar access
- [x] Add `team_leader_picture` field for team submissions
- [x] Add `get_absolute_url` helper to properly resolve file URLs with request context
- [x] Make profile_picture URLs absolute (using request.build_absolute_uri)

## Frontend - CompanySubmissionsReviewPage.jsx

- [x] Removed `toggleShortlistMember` import (simplified card)
- [x] Removed `Bot`, `MessageSquare`, `Send`, `UserCheck`, `UserPlus`, `X` unused icons
- [x] Removed `ScoreRing`, `Bot` score display, feedback UI from cards
- [x] Simplified SubmissionCard to a clean summary card with "View Full Solution & Review" link
- [x] **Removed mock pravatar fallback URL** - avatar now uses `item.avatar || null`
- [x] Avatar display logic: for team submissions uses `team_leader_picture`, otherwise `submitter_profile_picture`
- [x] Added `avatarError` state + `onError` handler for broken images
- [x] Shows `<UserRound>` icon placeholder when no avatar or broken image

## Frontend - SolutionDetailPage.jsx

- [x] Uses real `member.profile_picture` for team member avatars
- [x] Uses `submission.intern.profile_picture` for solo submitter avatar
- [x] `handleImageError` state + `onError` handler for broken images
- [x] Shows `<UserRound>` icon placeholder when no avatar available

## Frontend - StudentFeedbackPage.jsx

- [x] Removed mock `reviewerAvatar: https://i.pravatar.cc/...` field (was unused in template)

## Notes

- Backend `SubmissionSerializer` now returns:
  - `submitter` object with `id`, `first_name`, `last_name`, `email`, `username`, `profile_picture`, `institution`
  - `submitter_profile_picture` (direct URL)
  - `team_leader_picture` (direct URL for team submissions)
  - `team_members[].profile_picture` (already existed, now uses absolute URLs)
