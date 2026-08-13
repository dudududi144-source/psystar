# ✦ ארכיטקטורה ✦

## השכבות

1. **Core** — אבני יסוד חסרות תלות בדומיין: result, logger, event-bus, clock.
2. **Domain** — המודל המוזיקלי: pattern, transport, device.
3. **Protocol** — השפה: הודעות מובנות וקידוד בטוח.
4. **Engine** — התזמון: scheduler ממפה פעימות לאירועים; audio driver מבצע.
5. **UI** — המסע: state reducer, render, וקונסולת DMT חיה ב-web.

## זרימת נתונים

Transport מיייד פעימה → Scheduler קורא Step מתוך Pattern → Step פעיל הופך ל-ProtocolMessage → EventBus מפיץ → AudioDriver מבצע trigger → הקיילודוסקוב נושם.

## גבולות אחריות

- core/result: הצלחה או כשל, מפורש, בלי חריגות סמויות.
- core/logger: עקבתיות ודיאגנוסטיקה.
- core/event-bus: publish/subscribe מוכלל, בלי coupling.
- core/clock: מקור זמן אחד — אף אחד לא ממציא זמן לבד.
- domain/pattern: נתוני צעדים, גלישה בטוחה, מצב ריק בטוח.
- domain/transport: זמן, מצב ריצה, התקדמות אימוטבילית.
- protocol/codec: serialize/deserialize עם ולידציה מלאה.
- engine/scheduler: לא יודע מהו סאונד אמיתי — רק פולט אירועים.
- ui/state: reducer טהור, בלי side effects.

## הרחבות עתידיות

- MIDI driver אמיתי
- WebSocket bridge בין מכשירים
- Visualizer ספקטרלי מלא
- עורך תבניות גרפי
- persistence וסצנות
