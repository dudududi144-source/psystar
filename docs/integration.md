# ✦ אינטגרציית PSY · הגשר אל המשפחה ✦

## השכבה

src/integration היא נקודת המגע היחידה בין PSYSTAR לשאר משפחת PSY. שלושה מודולים:

1. **FoundationBridge** — צינור דו-כיווני. attach מחבר את ה-EventBus אל port חיצוני: כל ProtocolMessage יוצא הופך ל-FoundationEventShape דרך toFoundationEvent. ingest קולט אירועים מבחוץ, מאמת דרך fromFoundationEvent, ופולט פנימה רק מה שעבר. מונים עוקבים אחרי sent/received.

2. **DeviceRegistry** — גילוי מכשירים. register מוסיף רשומה, heartbeat מעדכן lastSeen, prune מנקה מכשירים מתים מעבר ל-TTL, ומחזיר את מה שנמחק כדי לאפשר תגובת UI.

3. **SyncProtocol** — שפת הסנכרון. שישה סוגי הודעות: presence, play, stop, grid, bpm, scene. ולידציה מלאה, בחירת מוביל דטרמיניסטית (resolveLeader), ומעגל תפקידים solo → leader → follower.

## מיפוי חבילות psy-foundation

- @psy-foundation/protocol (v1, canonical candidate) — צורת האירוע, FoundationEventShape, ממופה ישירות מ-ProtocolMessage.
- @psy-foundation/device-sdk (v1, canonical candidate) — נקודת הרישום של PSYSTAR כמכשיר.
- @psy-foundation/transport (v0, לא קנוני עדיין) — סנכרון שעון. עד שיתקנן, הגשר נשאר דפנסיבי ולא תלוי בגרסה.
- @psy-foundation/dsp (v1, canonical candidate) — יעד עתידי ל-FX chain משותף.
- @psy-foundation/material (v1, canonical candidate) — יעד עתידי לחומרים ויזואליים משותפים.

## סנכרון רב-מכשירי בקונסולה

הקונסולה מממשת את ה-SyncProtocol מעל BroadcastChannel:

- כל מכשיר מייצר מזהה קבוע (psy-xxxx) שנשמר במקומי.
- שלושה תפקידים: סולו, מוביל, עוקב.
- מוביל משדר: play, stop, bpm, scene, grid — אחרי כל שינוי מקומי.
- עוקב מקבל ומחיל: מנוע, קצב, סצנות, גריד שלם.
- presence עם heartbeat כל 3 שניות וניקוי peers מתים אחרי 10 שניות.
- מניית מכשירים חיה בפאנל הרשת.

כדי לראות את זה חי: פתחו את web/index.html בשני טאבים. באחד לחצו "הפוך למוביל", בשני "עקוב אחרי מוביל". עכשיו כל מה שתעשו במוביל — ינוע, קצב, סצנה, עריכת גריד — קורה גם בעוקב.

## כללי הגשר

1. PSYSTAR לעולם לא מייבא ישירות מגרסה לא קנונית של transport.
2. כל אירוע שיוצא החוצה עובר toFoundationEvent.
3. כל אירוע שנכנס פנימה עריך ולידציה מלאה — סוגים לא מוכרים נדחים.
4. שכבת integration היא נקודת הבידוד היחידה: אם psy-foundation משתנה, רק הקובץ הזה זז.
