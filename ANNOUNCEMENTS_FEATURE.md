# Announcements Feature

## Overview
A complete announcements system that allows gym admins to create, edit, and manage announcements that are displayed on the public homepage.

## Backend Implementation

### Model (Back-end/api/models.py)
```python
class Announcement(models.Model):
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### API Endpoints
- `GET /api/announcements/` - List all announcements
- `POST /api/announcements/` - Create new announcement
- `GET /api/announcements/{id}/` - Get specific announcement
- `PATCH /api/announcements/{id}/` - Update announcement
- `DELETE /api/announcements/{id}/` - Delete announcement

### Features
- Active/Inactive toggle for announcements
- Only active announcements are shown on homepage
- Sorted by creation date (newest first)

## Frontend Implementation

### Admin Panel (/admin/announcements)
**Location:** `Front-end/src/pages/AnnouncementsPage.tsx`

**Features:**
- Create new announcements with title and message
- Edit existing announcements
- Delete announcements
- Toggle active/inactive status
- Visual indicators for active vs inactive announcements
- Responsive design with modern UI

**UI Elements:**
- Megaphone icon for announcements
- Toggle switch for active/inactive status
- Color-coded status badges (green for active, gray for inactive)
- Modal for creating/editing announcements
- Confirmation dialog for deletions

### Homepage Display
**Location:** `Front-end/src/Home.tsx`

**Features:**
- Displays only active announcements
- Animated entrance for each announcement
- Responsive card layout
- Shows creation date
- Hover effects for better UX
- Automatically hidden if no active announcements

**Design:**
- Consistent with Sinen Fitness branding
- Orange accent colors
- Modern card-based layout
- Smooth animations using Framer Motion

## Sidebar Integration
**Location:** `Front-end/src/components/Sidebar.tsx`

- Added "Announcements" menu item with Megaphone icon
- Positioned between Payments and Sinen Team
- Active state highlighting
- Responsive mobile menu support

## Database Migration
Migration file created: `Back-end/api/migrations/0002_announcement.py`

**To apply migration:**
```bash
cd Back-end
python manage.py migrate
```

## Usage Guide

### For Admins

1. **Creating an Announcement:**
   - Navigate to `/admin/announcements`
   - Click "New Announcement" button
   - Enter title and message
   - Check "Display on homepage" to make it active
   - Click "Create"

2. **Editing an Announcement:**
   - Click the edit icon (pencil) on any announcement
   - Modify title or message
   - Toggle active status if needed
   - Click "Update"

3. **Toggling Active Status:**
   - Click the toggle switch on any announcement card
   - Active announcements show in green
   - Inactive announcements show in gray

4. **Deleting an Announcement:**
   - Click the delete icon (trash) on any announcement
   - Confirm deletion in the dialog

### For Website Visitors

- Announcements appear on the homepage between Testimonials and Pricing sections
- Only active announcements are visible
- Section is automatically hidden if no active announcements exist
- Each announcement shows:
  - Title (large, bold)
  - Message (detailed description)
  - Creation date

## Styling

### Colors
- Primary: Orange (#f97316)
- Background: Zinc-900 (#18181b)
- Text: White with gray variations
- Active badge: Green
- Inactive badge: Gray

### Typography
- Titles: Black weight, uppercase, italic
- Messages: Regular weight, gray-400
- Dates: Extra small, uppercase, tracking-widest

## API Response Format

### List Announcements
```json
[
  {
    "id": 1,
    "title": "New Class Schedule",
    "message": "Starting next week, we're adding morning aerobics classes at 6 AM!",
    "is_active": true,
    "created_at": "2026-03-12T10:30:00Z",
    "updated_at": "2026-03-12T10:30:00Z"
  }
]
```

## Benefits

✅ Easy content management for gym staff
✅ Real-time updates on homepage
✅ No code changes needed to add announcements
✅ Professional, modern design
✅ Mobile-responsive
✅ Smooth animations and transitions
✅ Active/inactive control for scheduling
✅ Consistent with existing design system

## Future Enhancements (Optional)

- Schedule announcements for future dates
- Add expiry dates for announcements
- Rich text editor for formatted messages
- Image attachments
- Priority/pinning system
- Email notifications when new announcements are posted
- Categories/tags for announcements
- Analytics (views, clicks)
