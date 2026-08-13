# ✦ אסטרטגיית בדיקות ✦

## רמות

1. Unit — core utilities: result, event-bus, logger.
2. Domain — pattern גלישה, transport התקדמות, device.
3. Protocol — codec roundtrip ודחיית קלט פסול.
4. Integration — scheduler פולט הודעות נכון עבור צעדים פעילים וכבויים.
5. Structure — scripts/check.ts מאמת קבצי חובה.

## כללים

- כל module מקבל בדיקה.
- בדיקות לא תלויות בסאונד אמיתי.
- אף secret לא נכנס לבדיקות.
- דטרמיניזם מוחלט.
- CI מריץ bun test ו-bun run check בכל push.

## פקודות

- bun test
- bun run check
- bun run manifest
