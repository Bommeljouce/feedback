# feedback

## Enthalten
- Feedback: anonym, Zustimmung/Ablehnung, Kommentare, Likes/Dislikes, sichtbare Dislikes, Zitate/Antwort-Hierarchie
- Allgemeine Infos: optionaler Name, bearbeiten/löschen
- Abstimmungen: Name erforderlich, Single-/Multiple-Choice, bearbeiten/löschen
- Löschen immer mit Bestätigung
- Kleine Stift-/Löschen-Symbole oben rechts
- Mobile Layout
- Kein Login für Besucher

## Schnelltest ohne Backend
`app.js` hat `API_URL = ""`. Dann werden Daten lokal im Browser gespeichert.

## Für gemeinsame Nutzung auf GitHub Pages
GitHub Pages selbst kann keine von Besuchern geschriebenen Daten speichern. Deshalb wird für die gemeinsame Version ein sehr kleines Google-Apps-Script-Backend verwendet. Besucher benötigen dafür keinen Login.

1. Eine Google-Tabelle anlegen.
2. In der Tabelle: Erweiterungen → Apps Script.
3. Den Inhalt von `backend.gs` einfügen und speichern.
4. Bereitstellen → Neue Bereitstellung → Web-App.
5. Ausführen als: Ich selbst.
6. Zugriff: Jeder.
7. Die Web-App-URL kopieren.
8. In `app.js` bei `const API_URL = "";` die URL eintragen.
9. `index.html`, `style.css`, `app.js` und `backend.gs` können danach auf GitHub Pages liegen. `backend.gs` muss nicht öffentlich auf GitHub liegen; es dient nur als Vorlage.

Hinweis: "Jeder kann alles löschen" bedeutet bewusst, dass jede Person jeden Eintrag löschen kann. Feedback und Kommentare sind nicht bearbeitbar.
