# Nudgley local storage schema baseline

The current prototype stores data in browser `localStorage` and one session-only onboarding flag in `sessionStorage`.

## Storage keys

| Key | Current purpose | Notes |
| --- | --- | --- |
| `nudgley_tasks` | Open board tasks | Array of task-like objects. |
| `nudgley_profile` | Coaching memory | Stores learned `insights`, `patterns` and `lastUpdated`. |
| `nudgley_stats` | Simple counters | Currently includes task and coaching-session counters. |
| `nudgley_completed` | Completed task archive | All-time archive capped by current code. |
| `nudgley_reentry` | Re-entry snapshot | Stores timestamp, task count, immediate task and task ids. |
| `nudgley_reentry_dismissed` | Daily dismissal marker | Raw date string. |
| `nudgley_done_log` | Recent completion/momentum log | Used for today momentum and weekly review. |
| `nudgley_onboarding_done` | Onboarding completion | Raw string flag in local storage. A session-only skip also uses this key in `sessionStorage`. |
| `nudgley_last_rollover` | Last daily rollover date | Raw date string. |
| `nudgley_user_profile` | User onboarding/profile settings | Name, tone, friction, energy pattern, notification preference and setup metadata. |
| `nudgley_triage_mode` | Re-entry recommendation mode | Raw string such as `balanced`, `quickwins` or `frog`. |
| `nudgley_notif_settings` | Foreground nudge settings | Frequency and configured times. |
| `nudgley_weekly_data` | Reserved/unclear | Key exists in code but no stable active schema is documented yet. |
| `nudgley_last_notif` | Reserved/unclear | Key exists in code but no stable active schema is documented yet. |

## Current task shape

Current open tasks are expected to support these fields:

```json
{
  "id": "string",
  "text": "string",
  "notes": "string",
  "bucket": "immediate|today|tomorrow|week|planned",
  "createdAt": "YYYY-MM-DD or date-like string",
  "dueDate": "YYYY-MM-DD|null",
  "scheduledDate": "YYYY-MM-DD|null",
  "lastMovedAt": "YYYY-MM-DD or date-like string",
  "completedAt": "null or date-like string",
  "moveCount": 0,
  "status": "on-track",
  "enhancement": {
    "refined": "string",
    "steps": ["string"],
    "startHere": "string",
    "effort": "string",
    "storedAt": "ISO timestamp"
  }
}
```

`status` is currently stored but should become derived during the typed-domain migration.

## Migration rule

Existing local data must be treated as user data. Future schema changes should use explicit versioned migrations and should tolerate missing, corrupt or obsolete fields.
