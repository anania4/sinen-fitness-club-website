# Member Status Automation System

## Overview
The system automatically manages member statuses based on expiry dates and payment status, ensuring accurate membership tracking without manual intervention.

## Auto-Status Logic

### Status Calculation Rules

1. **EXPIRED** - Automatically set when:
   - Expiry date has passed (< today)
   - Overrides any previous status except Frozen/Suspended

2. **ACTIVE** - Automatically set when:
   - Payment status is "Paid"
   - Expiry date is in the future (>= today)

3. **SUSPENDED** - Automatically set when:
   - Payment status is "Overdue"
   - Member cannot access gym until payment is made

4. **FROZEN** - Manual status (not auto-updated):
   - Set by admin when member pauses membership
   - Time doesn't count down
   - Protected from auto-updates

### When Status Updates Happen

1. **On Member Creation** - Status calculated based on payment and expiry date
2. **On Member Update** - Status recalculated (unless Frozen/Suspended)
3. **On List/Retrieve** - All member statuses refreshed before display
4. **On Dashboard Load** - Bulk status update for all members

## Expiring Members Dashboard

### Display Logic

Members shown in "Memberships Expiring Soon" section are sorted by urgency:

1. **Expired Members** (Red badge with pulse animation)
   - Expiry date < today
   - Shown first (most urgent)

2. **Critical (0-3 days)** (Orange badge)
   - Requires immediate attention

3. **Warning (4-7 days)** (Yellow badge)
   - Needs follow-up soon

4. **Normal (8-14 days)** (Gray badge)
   - Standard renewal timeline

### Sorting
- Sorted by expiry date (earliest first)
- Expired members appear at the top
- Most urgent renewals prioritized

## Payment Status Impact

### Paid
- Member status → Active (if expiry date valid)
- Full gym access

### Pending
- Member status → Active (if expiry date valid)
- Awaiting payment confirmation

### Overdue
- Member status → Suspended
- Gym access blocked
- Requires payment to reactivate

## Protected Statuses

### Frozen
- Set manually by admin
- NOT auto-updated by system
- Used when member pauses membership
- Expiry date should be extended when unfrozen

### Suspended
- Can be set manually OR automatically (overdue payment)
- Used for rule violations or payment issues
- NOT auto-updated once set manually

## API Endpoints

### GET /api/dashboard/stats
Returns dashboard statistics with auto-updated counts:
- totalMembers
- activeMembers
- expiringSoon (includes expired + expiring within 14 days)
- newLeads

### GET /api/dashboard/expiring-members
Returns members sorted by urgency:
- Expired members first
- Then expiring within 14 days
- Sorted by expiry date (earliest first)
- Excludes Frozen/Suspended members

### GET /api/members/
Auto-updates all member statuses before returning list

### PATCH /api/members/{id}/
Auto-calculates status on update (unless Frozen/Suspended)

## Frontend Features

### Dashboard Display
- Color-coded status badges
- Animated pulse for expired members
- Days remaining calculation
- Quick "Renew" button to navigate to members page

### Status Badge Colors
- 🔴 Red (Expired): Past expiry date
- 🟠 Orange (Critical): 0-3 days remaining
- 🟡 Yellow (Warning): 4-7 days remaining
- ⚫ Gray (Normal): 8-14 days remaining

## Usage Examples

### Adding a New Member
```javascript
// Frontend sends:
{
  name: "John Doe",
  phone: "0911234567",
  plan: "Monthly",
  start_date: "2026-03-01",
  expiry_date: "2026-04-01",  // Auto-calculated
  payment_status: "paid"
  // status is auto-calculated by backend
}

// Backend calculates:
// - expiry_date (2026-04-01) > today → valid
// - payment_status = "paid"
// → status = "active"
```

### Member Expiry
```javascript
// Member with expiry_date = "2026-03-10"
// Today = "2026-03-12"

// On next API call:
// - expiry_date < today
// → status auto-updated to "expired"
```

### Payment Overdue
```javascript
// Admin updates payment_status to "overdue"

// Backend automatically:
// - payment_status = "overdue"
// → status = "suspended"
```

## Best Practices

1. **Let the system handle status** - Don't manually set Active/Expired
2. **Use Frozen for pauses** - Protects from auto-updates
3. **Use Suspended for violations** - Manual control when needed
4. **Update payment status** - Drives automatic status changes
5. **Check dashboard daily** - Monitor expiring members proactively

## Benefits

✅ No manual status updates needed
✅ Always accurate membership data
✅ Proactive renewal management
✅ Reduced administrative overhead
✅ Better member experience
✅ Clear urgency prioritization
