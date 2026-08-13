<div align="center">

# ✦ PSYSTAR ✦ מכונת התודעה ✦

**התקן מוזיקלי פסיכודלי מקצה לקצה — לב קצב, סינתזה, מסע ויזואלי, רשת משפחתית, גשרים בין עולמות, נהגים אמיתיים, זיכרון, ספריית חלומות, מקדש נייד ומגע חי במערכת קנונית אחת**

![grade](https://img.shields.io/badge/PSYSTAR-DMT%20GRADE-ff2bd6?style=for-the-badge)
![engine](https://img.shields.io/badge/engine-Bun-7b2ff7?style=for-the-badge)
![tests](https://img.shields.io/badge/tests-passing-00f0ff?style=for-the-badge)
![phases](https://img.shields.io/badge/phases-11%2F11-ffd166?style=for-the-badge)
![pwa](https://img.shields.io/badge/PWA-installable-00f0ff?style=for-the-badge)
![midi](https://img.shields.io/badge/MIDI-in%2Bout-7b2ff7?style=for-the-badge)
![p2p](https://img.shields.io/badge/P2P-serverless-ff2bd6?style=for-the-badge)
![license](https://img.shields.io/badge/license-MIT-ffd166?style=for-the-badge)

*שום דבר כאן לא מקרי. כל החלטה עברה Roast Gate. כל קוד נבדק. כל פיקסל נושם.*

</div>

---

## ✦ מה זה PSYSTAR

PSYSTAR אינו עוד סקוונסר. זו **פלטפורמת התקן קנונית** ממשפחת PSY, הבנויה כמערכת שכבתית שבה כל שכבה יודעת את תפקידה — ורק אותו:

- **Core** — תשתיות יסוד: תוצאות, לוגים, אירועים, שעונים, היסטוריה.
- **Domain** — המודל המוזיקלי: תבניות, תחבורה, התקנים, סצנות, שירים, קצב אוקלידי, פריסטים, יומני מסע, ספריות.
- **Protocol** — השפה המשותפת: הודעות וקידוד.
- **Engine** — הלב: תזמון, ADSR, ניהול קולות, ראק אפקטים, MIDI דו-כיווני, הקלטה, טאפ קצב.
- **Integration** — הגשרים: foundation-bridge, device-registry, sync-protocol, p2p-signaling.
- **UI** — המסע: קונסולת DMT חיה, נגינה חיה, מגע חי, ומקדש PWA נייד.

## ✦ מה המכונה יודעת

- תזמון lookahead מדויק עם סווינג
- 4 סצנות קנוניות + מצב מסע (song mode)
- ADSR מלא, ניהול קולות עם steal, limiter
- ראק אפקטים: פילטר נושם, crusher, phaser, delay, reverb
- זיכרון פורטל: פריסטים, לכידה ושחזור
- חלימה: מורפינג חי בין כל שני עולמות
- אלכימיית קצב: יוצר אוקלידי לכל ערוץ עם סיבוב
- רשת משפחתית: מוביל/עוקב, סנכרון play/stop/bpm/scene/grid
- **גשר בין עולמות: סנכרון P2P בין מכשירים רחוקים, WebRTC ללא שרת**
- הקלטת מסע חיה וייצוא כקובץ
- MIDI דו-כיווני: יציאה לסינתזה + כניסה ממקלדת, עם פאניקה
- טבעת ספקטרום חיה סביב הקיילודוסקופ
- יומן מסע: חמוש, לכידה, ניגון זיכרון מלא
- יצוא סצנות ויומנים כ-JSON ויבוא חזרה
- ספריית חלומות: slots עם שמות, קיבולת, persistence
- נגינה חיה: מקשים 1-4 ערוצים, A עד K סולם פנטטוני
- מקדש נייד: מתקין כאפליקציה, עובד אופליין
- מגע חי: טאפ קצב, ביטול/ביצוע מחדש עם קיצורי מקלדת

## ✦ עקרונות על

1. **Roast לפני ביצוע** — כל צעד נשחט קודם: למה לא, למה כן, ואיך פורצים מסגרת.
2. **הפרדה מוחלטת** — אף שכבה לא מדברת עם שכבה שלא דרך חוזה מפורש.
3. **בדיקות הן ארכיטקטורה** — לא רשת ביטחון, אלא חלק מהמערכת.
4. **אין סודות בקוד** — לא טוקנים, לא `.env`, לא שום דבר רגיש. לעולם.
5. **פרימיום או כלום** — לא בסיסי, לא מינימלי; מלא, מפורט, מקצה לקצה.

## ✦ התחלה מהירה

- `bun install` — התקנת תלויות
- `bun run dev` — הרצת המנוע
- `bun test` — כל הבדיקות
- `bun run check` — בדיקת מבנה

פתחו את `web/index.html` בדפדפן, לחצו **הפעלה**, והניחו לקיילודוסקוב לנשום.

**גשר בין עולמות:** במכשיר א' לחצו **יצירת גשר (מארח)** והעתיקו את האות. במכשיר ב' הדביקו ולחצו **הצטרפות (אורח)**, העתיקו את התשובה חזרה. במכשיר א' הדביקו ולחצו **קבלת תשובה** — ושני העולמות מנגנים יחד, ישירות, בלי שרת.

## ✦ מבנה

- `docs/` — ארכיטקטורה, roast, החלטות, בדיקות, עיצוב, אינטגרציה, מפת דרכים
- `src/` — core · domain · protocol · engine · integration · ui
- `tests/` — unit · domain · protocol · engine · integration · drivers · journey · library · pwa · touch · p2p
- `scripts/` — check · manifest
- `web/` — מסך ה-DMT, manifest, service worker, אייקוני מנדלה
- `.github/` — CI

## ✦ פילוסופיית עיצוב

פסיכודלי DMT ברמה הנדסית: מגנטה `#ff2bd6`, ציאן `#00f0ff`, זהב `#ffd166`, סגול `#7b2ff7`.
גאומטריה קדושה, נשימה איטית, מורפינג, זוהר ישויות — והכול מגובה ב-`docs/design.md`.

---

<div align="center">

**PSYSTAR — לא מכשיר. שער. צומת. כלי. זיכרון. ספרייה. מקדש. מכונה שמקשיבה. וגשר בין עולמות.**

</div>
