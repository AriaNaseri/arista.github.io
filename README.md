# Projektwerkstatt – 20 IT-Projekte

Deutschsprachige Präsentation auf Grundlage von `Projektkatalog - 20 IT-Projekte.docx`.

Die 35 Folien stellen den gesamten Katalog vor: Einführung und Arbeitsplan, alle 20 Projektaufträge mit Pflichtumfang und Abnahmetests sowie Tests, Risiken, Kosten, Dokumentation und Abgabe. Die beiden umfangreichen FILIUS-Projekte erhalten jeweils zwei Folien. Ihre sechs Abnahmetests sind vollständig enthalten; die übrigen Projekte haben jeweils fünf.

Die im Katalog empfohlenen 6–8 Folien beziehen sich auf ein einzelnes Teilnehmerprojekt. Diese Datei ist eine Einführung in den gesamten Projektkatalog.

## Dateien

- `index.html`: Browser-Einstieg mit Titelvorschau und Downloads; keine externen Abhängigkeiten.
- `projektkatalog-20-it-projekte.pptx`: editierbare PowerPoint-Präsentation im Format 16:9.
- `projektkatalog-20-it-projekte.pdf`: PDF derselben 35 Folien.
- `source/`: JavaScript-Quelldatei, Projektdaten, Hilfsfunktionen und festgeschriebene Node-Abhängigkeiten zur Neuerstellung.

Die PowerPoint-Notizen enthalten die zugehörigen Projektbeschreibungen aus der Quelle. Die Abnahmetests sind Anforderungen; es werden keine tatsächlich ausgeführten Teilnehmerprojekte oder Testergebnisse behauptet.

## Bearbeiten

Die PPTX lässt sich direkt in PowerPoint oder LibreOffice Impress bearbeiten. Verwendete Schrift: **DejaVu Sans**. Bei fehlender Schrift kann sich der Textumbruch ändern.

Für eine Neuerstellung mit Node.js (getestet mit Version 24):

```bash
cd source
npm ci
node build.js
```

`build.js` erzeugt die PPTX im Ordner `source/`. Nach einer Änderung erneut rendern, das Layout prüfen und die fertige Datei in den übergeordneten Ordner kopieren. Unter Linux benötigt `skia-canvas` die üblichen Fontconfig-Bibliotheken.

PDF mit installiertem LibreOffice exportieren:

```bash
libreoffice --headless --convert-to pdf --outdir .. projektkatalog-20-it-projekte.pptx
```

## Browser

`index.html` direkt öffnen oder das Repository mit einem statischen HTTP-Server bereitstellen. Alle Download- und Bildpfade sind relativ, sodass der Ordner auch unter einem GitHub-Pages-Unterpfad funktioniert.
