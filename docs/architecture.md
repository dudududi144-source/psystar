# ✦ ארכיטקטורה ✦

## השכבות

1. **Core** — אבני יסוד חסרות תלות בדומיין: result, logger, event-bus, clock.
2. **Domain** — המודל המוזיקלי: pattern, transport, device, scene, song, euclidean, preset.
3. **Protocol** — השפה: הודעות מובנות וקידוד בטוח.
4. **Engine** — הלב: scheduler, lookahead-scheduler, envelope, voice-manager, effects-rack, audio-driver, foundation-adapter.
5. **Integration** — הגשר אל משפחת PSY: foundation-bridge, device-registry, sync-protocol.
6. **UI** — המסע: state reducer, render, וקונסולת DMT חיה ב-web.

## זרימת נתונים

Transport מייצר פעימה → LookaheadScheduler מתכנן צעדים על ציר זמן מדויק → כל צעד פעיל הופך ל-ProtocolMessage → EventBus מפיץ → VoiceManager מקצה קול → Envelope מעצב את הנשימה → EffectsRack צובע את הצליל → AudioDriver מבצע → הקיילודוסקופ נושם.

## זרימת מסע (Song Mode)

Song מגדיר שרשרת סצנות עם אורך לכל אחת. במהלך ניגון, sceneAtBar מחזיר את הסצנה הפעילה לפי ה-bar הגלובלי, והקונסולה מחליפה את הרשת בהתאם — מסע עם התחלה, עלייה ונחיתה.

## זרימת זיכרון (Presets + Morphing)

Preset לוכד את כל מצב המכונה — גריד + פרמטרים. morphPresets ממזג שני עולמות לפי t, הן בגריד (סף 0.5) והן בכל פרמטר. הקונסולה מאפשרת לכידת פורטל אישי, שחזורו, וחלימה חיה בין כל שני פריסטים.

## יצירת קצב (Euclidean)

euclidean(pulses, steps, rotation) מחלק פעימות באופן שווה ככל האפשר — הקצב הפסיכדלי הקלאסי. כל ערוץ בקונסולה מקבל יוצר אוקלידי עצמאי עם סיבוב, כך שניתן לארוג פוליריתמיה שלמה בלחיצה.

## זרימת רשת (Multi-Device Sync)

SyncProtocol מגדיר הודעות presence/play/stop/grid/bpm/scene עם תפקידי solo/leader/follower. הקונסולה מממשת זאת מעל BroadcastChannel: מוביל משדר כל שינוי, עוקבים מחילים, presence שומר על מניית מכשירים חיה. FoundationBridge מחבר את כל זה החוצה אל psy-foundation דרך port יחיד ומבודד.

## גבולות אחריות

- core/result: הצלחה או כשל, מפורש, בלי חריגות סמויות.
- core/logger: עקביות ודיאגנוסטיקה.
- core/event-bus: publish/subscribe מוכלל, בלי coupling.
- core/clock: מקור זמן אחד — אף אחד לא ממציא זמן לבד.
- domain/pattern: נתוני צעדים, גלישה בטוחה, מצב ריק בטוח.
- domain/scene: סצנות קנוניות, ולידציה מבנית.
- domain/song: שרשרת סצנות, loop, רזולוציה לפי bar.
- domain/euclidean: חלוקת פעימות שווה, סיבוב, צפיפות.
- domain/preset: לכידת מצב מלא, ולידציה, מורפינג בין עולמות.
- domain/transport: זמן, מצב ריצה, התקדמות אימוטבילית.
- protocol/codec: serialize/deserialize עם ולידציה מלאה.
- engine/scheduler: לא יודע מהו סאונד אמיתי — רק פולט אירועים.
- engine/lookahead-scheduler: תכנון צעדים בחלון זמן, סווינג, גלישה.
- engine/envelope: ADSR — מתן ערך לפי זמן ושער.
- engine/voice-manager: הקצאת קולות, steal של הזנב, מניעת הצפה.
- engine/effects-rack: תיאור אפקטים חסין-שינוי, סינון פעילים.
- engine/foundation-adapter: המרה נקודתית של אירועים, הלוך ושוב.
- integration/foundation-bridge: צינור חי בין bus לעולם, עם מונים.
- integration/device-registry: גילוי, heartbeat, prune.
- integration/sync-protocol: הודעות, תפקידים, בחירת מוביל.
- ui/state: reducer טהור, בלי side effects.

## הרחבות עתידיות

- חיבור ישיר ל-psy-foundation עם transport קנוני
- MIDI driver אמיתי
- WebSocket bridge בין מכשירים רחוקים
- Visualizer ספקטרלי מלא
- עורך תבניות גרפי
- הקלטת מסע וייצוא
