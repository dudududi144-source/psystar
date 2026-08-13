# ✦ אינטגרציית PSY · הגשר אל המשפחה ✦

## המפה

PSYSTAR הוא אזרח במשפחת PSY. הגשר אל psy-foundation עובר דרך engine/foundation-adapter.

## מיפוי חבילות

- @psy-foundation/protocol (v1, canonical candidate) — צורת האירוע של PSYSTAR, FoundationEventShape, ממופה ישירות מ-ProtocolMessage: type, channel, data.
- @psy-foundation/device-sdk (v1, canonical candidate) — נקודת הרישום של PSYSTAR כמכשיר במשפחה.
- @psy-foundation/transport (v0, לא קנוני עדיין) — סנכרון שעון. עד שה-transport יתקנן, ה-adapter נשאר דפנסיבי ולא תלוי בגרסה.
- @psy-foundation/dsp (v1, canonical candidate) — יעד עתידי ל-FX chain משותף.
- @psy-foundation/material (v1, canonical candidate) — יעד עתידי לחומרים ויזואליים משותפים.

## כללי הגשר

1. PSYSTAR לעולם לא מייבא ישירות מגרסה לא קנונית של transport.
2. כל אירוע שיוצא החוצה עובר toFoundationEvent.
3. כל אירוע שנכנס פנימה עובר fromFoundationEvent עם ולידציה מלאה — סוגים לא מוכרים נדחים.
4. ה-adapter הוא נקודת הבידוד היחידה: אם psy-foundation משתנה, רק קובץ אחד ב-PSYSTAR זז.

## מצב נוכחי

ה-adapter קיים, נבדק, ומגדיר את צורת החוזה. החיבור בפועל ל-psy-foundation יקרה בשלב 5, לאחר שה-transport של ה-foundation יגיע למעמד קנוני.
