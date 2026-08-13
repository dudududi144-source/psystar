# ✦ ארכיטקטורה ✦

## השכבות

1. **Core** — אבני יסוד חסרות תלות בדומיין: result, logger, event-bus, clock.
2. **Domain** — המודל המוזיקלי: pattern, transport, device, scene, song.
3. **Protocol** — השפה: הודעות מובנות וקידוד בטוח.
4. **Engine** — הלב: scheduler, lookahead-scheduler, envelope, voice-manager, effects-rack, audio-driver, foundation-adapter.
5. **UI** — המסע: state reducer, render, וקונסולת DMT חיה ב-web.

## זרימת נתונים

Transport מייצר פעימה → LookaheadScheduler מתכנן צעדים על ציר זמן מדויק → כל צעד פעיל הופך ל-ProtocolMessage → EventBus מפיץ → VoiceManager מקצה קול → Envelope מעצב את הנשימה → EffectsRack צובע את הצליל → AudioDriver מבצע → הקיילודוסקופ נושם.

## זרימת מסע (Song Mode)

Song מגדיר שרשרת סצנות עם אורך לכל אחת. במהלך ניגון, sceneAtBar מחזיר את הסצנה הפעילה לפי ה-bar הגלובלי, והקונסולה מחליפה את הרשת בהתאם — מסע עם התחלה, עלייה ונחיתה.

## גבולות אחריות

- core/result: הצלחה או כשל, מפורש, בלי חריגות סמויות.
- core/logger: עקביות ודיאגנוסטיקה.
- core/event-bus: publish/subscribe מוכלל, בלי coupling.
- core/clock: מקור זמן אחד — אף אחד לא ממציא זמן לבד.
- domain/pattern: נתוני צעדים, גלישה בטוחה, מצב ריק בטוח.
- domain/scene: סצנות קנוניות, ולידציה מבנית.
- domain/song: שרשרת סצנות, loop, רזולוציה לפי bar.
- domain/transport: זמן, מצב ריצה, התקדמות אימוטבילית.
- protocol/codec: serialize/deserialize עם ולידציה מלאה.
- engine/scheduler: לא יודע מהו סאונד אמיתי — רק פולט אירועים.
- engine/lookahead-scheduler: תכנון צעדים בחלון זמן, סווינג, גלישה.
- engine/envelope: ADSR — מתן ערך לפי זמן ושער.
- engine/voice-manager: הקצאת קולות, steal של הזנב, מניעת הצפה.
- engine/effects-rack: תיאור אפקטים חסין-שינוי, סינון פעילים.
- engine/foundation-adapter: גשר אל psy-foundation, הלוך ושוב.
- ui/state: reducer טהור, בלי side effects.

## הרחבות עתידיות

- MIDI driver אמיתי
- WebSocket bridge בין מכשירים
- Visualizer ספקטרלי מלא
- עורך תבניות גרפי
- persistence וסצנות
