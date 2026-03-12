# Dashboard Notifications System

## Overview
A smart notification system that provides real-time alerts and insights on the dashboard to help gym managers stay on top of critical tasks.

## Features Implemented

### 1. Revenue Chart Fix
- Fixed revenue data parsing to ensure amounts are always numbers
- Added `parseFloat()` conversion in Dashboard.tsx
- Chart now displays properly with correct data types

### 2. Intelligent Notifications

The notification system automatically analyzes dashboard data and displays actionable alerts:

#### Critical Notifications (Red - Error)
**Expired Memberships**
- Triggers when members have passed their expiry date
- Shows count of expired members
- Action button: "View Members" → navigates to members page
- Message: "X member(s) have expired memberships. Contact them for renewal."

#### Warning Notifications (Orange)
**Memberships Expiring Soon (0-3 days)**
- Triggers when members will expire within 3 days
- Shows count of critical expiring members
- Action button: "View Details" → navigates to members page
- Message: "X member(s) will expire in the next 3 days. Send reminders now."

**Low Active Member Rate**
- Triggers when active members < 50% of total members
- Shows percentage of active members
- Action button: "View Members"
- Message: "Only X% of members are active. Consider running a re-engagement campaign."

#### Info Notifications (Blue)
**Pending Leads**
- Triggers when there are leads with 'pending' status
- Shows count of pending leads
- Action button: "Contact Leads" → navigates to leads page
- Message: "You have X pending trial request(s) to follow up with."

#### Success Notifications (Green)
**Excellent Retention Rate**
- Triggers when active members ≥ 80% of total members
- Shows retention percentage
- No action needed - just positive feedback
- Message: "X% of your members are active. Keep up the great work!"

## Component Structure

### DashboardNotifications Component
**Location:** `Front-end/src/components/DashboardNotifications.tsx`

**Props:**
```typescript
{
  expiringMembers: Member[];  // List of expiring/expired members
  leads: Lead[];              // List of leads
  stats: DashboardStats;      // Dashboard statistics
  onDismiss?: (id: string) => void;  // Optional dismiss callback
}
```

**Features:**
- Dismissible notifications (X button in top-right)
- Color-coded by severity (red, orange, blue, green)
- Icon indicators for each type
- Action buttons for quick navigation
- Automatic calculation of metrics
- Persistent dismissal (stays dismissed during session)

## Notification Logic

### Expired Members
```typescript
const expiredMembers = expiringMembers.filter(m => {
  const expiry = new Date(m.expiry_date);
  const today = new Date();
  return expiry < today;
});
```

### Critical Expiring (0-3 days)
```typescript
const criticalExpiring = expiringMembers.filter(m => {
  const expiry = new Date(m.expiry_date);
  const today = new Date();
  const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 3;
});
```

### Retention Rate
```typescript
const retentionRate = (activeMembers / totalMembers) * 100;
// Success if >= 80%
// Warning if < 50%
```

## UI Design

### Notification Card Structure
```
┌─────────────────────────────────────────┐
│ [Icon] Title                         [X]│
│        Message text here                │
│        [Action Button →]                │
└─────────────────────────────────────────┘
```

### Color Scheme
- **Error (Red)**: `bg-red-500/10 border-red-500/30 text-red-500`
- **Warning (Orange)**: `bg-orange-500/10 border-orange-500/30 text-orange-500`
- **Success (Green)**: `bg-green-500/10 border-green-500/30 text-green-500`
- **Info (Blue)**: `bg-blue-500/10 border-blue-500/30 text-blue-500`

### Icons
- Error: `AlertCircle`
- Warning: `AlertTriangle`
- Success: `CheckCircle`
- Info: `Info`

## Dashboard Layout

The notifications appear at the top of the dashboard, right after the header and before the stats cards:

```
Dashboard Overview
├── Notifications (if any)
├── Stats Grid (4 cards)
└── Main Content
    ├── Revenue Chart
    ├── Expiring Members Table
    ├── Leads Table
    └── Recent Payments Table
```

## Usage Example

```typescript
<DashboardNotifications 
  expiringMembers={expiringMembers}
  leads={leads}
  stats={stats}
/>
```

## Benefits

✅ **Proactive Management** - Alerts appear automatically based on data
✅ **Actionable Insights** - Each notification has a clear action
✅ **Priority-Based** - Critical issues shown first (red → orange → blue → green)
✅ **Non-Intrusive** - Can be dismissed if not relevant
✅ **Quick Navigation** - Action buttons link directly to relevant pages
✅ **Smart Calculations** - Automatically analyzes data for insights
✅ **Visual Clarity** - Color-coded for quick scanning

## Future Enhancements (Optional)

- Persistent dismissal across sessions (localStorage)
- Notification preferences/settings
- Email/SMS integration for critical alerts
- Notification history log
- Custom notification rules
- Snooze functionality
- Sound alerts for critical notifications
- Desktop notifications (browser API)
- Notification badges in sidebar menu items
