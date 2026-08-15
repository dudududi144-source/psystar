export interface ShortcutDef {
  key: string;
  action: string;
}

export function getKeyboardShortcuts(): ShortcutDef[] {
  return [
    { key: 'Space', action: 'הפעלה / עצירה' },
    { key: '1-4', action: 'נגינת ערוצים חיה' },
    { key: 'A-K', action: 'נגינת תווים' },
    { key: 'Ctrl+Z', action: 'ביטול' },
    { key: 'Ctrl+Shift+Z / Ctrl+Y', action: 'ביצוע מחדש' },
    { key: '?', action: 'פתיחת עזרה זו' },
    { key: 'Esc', action: 'סגירת העזרה' }
  ];
}

export function getMouseGestures(): ShortcutDef[] {
  return [
    { key: 'Shift+קליק', action: 'אקסנט על תא' },
    { key: 'קליק ימני', action: 'הסתברות על תא' },
    { key: 'Alt+קליק', action: 'טרנספוזיציה במגילה' }
  ];
}

export function hasDuplicateKeys(defs: ShortcutDef[]): boolean {
  var seen: Record<string, boolean> = {};

  for (var i = 0; i < defs.length; i++) {
    if (seen[defs[i].key]) return true;

    seen[defs[i].key] = true;
  }

  return false;
}
