# Syntax der Unit-Definition
Bei der Unit-Definition handelt es sich um eine normale Text-Datei. Jede Zeile 
enthält die Definition eines Eingabeelementes, eines Textes oder eines 
Elementes zur Strukturierung. Jede Zeile enthält als erstes ein Schlüsselwort 
und kann dahinter weitere Parameter enthalten, jeweils getrennt mit `::`.

* Die erste Zeile MUSS lauten `iqb-scripted::1.0`.
* Am Ende einer Definitionszeile kann nach `??` noch weiterer Text angefügt werden, 
der als Hilfe-/Hinweistext verwendet wird (Abruf über gesonderten Schalter).
* Eine leere Zeile erzeugt einen Abstand im Formular in der Höhe eines 
Text-Elementes.
* Vor dem Schlüsselwort können Leer- oder Tabzeichen eingefügt werden, um die 
Lesbarkeit des Scriptes zu erhöhen. Sie werden bei der Auswertung ignoriert.

## Statische Texte, Linien, Kommentare
Wird bei den Schlüsselworten title, header oder text der jeweilige Parameter 
weggelassen, wird ein Zeilenabstand in der jeweiligen Höhe eingefügt.
  
| Schlüsselwort | Bedeutung | Parameter |
| :------------- | :------------- | :------------- |
| `title` | eine Zeile Text als oberste Gliederungsüberschrift | Text des Titels (optional)|
| `header` | eine Zeile Text als zweite Gliederungsüberschrift | Text der Überschrift (optional)|
| `text` | Standard-Text | Text (optional)|
| `html`| wird genau so in das Formular übernommen; zur Lösung besonderer Layout-Probleme| Html-Text|
| `hr`| stellt eine horizontale Linie dar | *keine* | 
| `rem`| leitet einen Kommentar ein, der bei der Verarbeitung ignoriert wird |  | 

#### Beispiele
```
title::na sowas!
html::And now <strong>this text here is bolded</strong>
hr
rem::ab hier noch Nummern der Fragen prüfen!!!!!
html::And hyperlinks such as <a href=”https://www.iqb.hu-berlin.de”>this one to the IQB website</a>
header::Abschnitt 223
```

## Eingabe von Text oder Zahl
| Schlüsselwort | Parameter | Standardwert |
| :------------- | :------------- | :------------- |
| `input-text` | 1. Name der Variablen, in die die Eingabe gespeichert werden soll | *Angabe ist erforderlich*|
|  | 2. Pflichtfeld: `0`=nein, `1`=ja|`0`|
|  | 3. Text vor dem Eingabefeld (Eingabeaufforderung)|*kein Text*|
|  | 4. Text nach dem Eingabefeld|*kein Text*|
|  | 5. Anzahl von Zeilen (>1 bedeutet mehrzeiliges Eingabefeld)|1|
|  | 6. maximale Anzahl von Zeichen bei der Eingabe|*unbegrenzt*
| `input-number` | 1. Name der Variablen, in die die Eingabe gespeichert werden soll | *Angabe ist erforderlich*|
|  | 2. Pflichtfeld: `0`=nein, `1`=ja|`0`|
|  | 3. Text vor dem Eingabefeld (Eingabeaufforderung)|*kein Text*|
|  | 4. Text nach dem Eingabefeld|*kein Text*|
|  | 5. Minimalwert|*kein*|
|  | 6. Maximalwert|*kein*|

#### Beispiele
```
input-number::task12ahmfA::1::Teilaufgabe 1.2a (Analysis)::::0::10
input-text::note::0::Weitere Kommentare zu den Prüfungsaufgaben (optional)::::20??Abschließend haben Sie an dieser Stelle die Möglichkeit, zusätzliche Hinweise und Kommentare zu den Prüfungsaufgaben und Erwartungshorizonten festzuhalten.
```
## Ankreuzen/Auswählen
Bei einer `checkbox` kreuzt man nur an. Bei `multiple-choice` werden die Optionen 
untereinander dargestellt und es kann nur eine Option ausgewählt werden. Bei
`drop-down` werden die Optionen in eine Klappbox gepackt, was Platz spart.  

| Schlüsselwort | Parameter | Standardwert |
| :------------- | :------------- | :------------- |
| `checkbox` | 1. Name der Variablen, in die die Eingabe gespeichert werden soll | *Angabe ist erforderlich*|
|  | 2. Pflichtfeld: `0`=nein, `1`=ja|`0`|
|  | Achtung: Pflichtfeld bedeutet hier, dass die Checkbox ausgewählt/angekreuzt sein muss (z. B. Zustimmung zu Datenschutzfragen).||
|  | 3. Text vor dem Eingabefeld (Eingabeaufforderung)|*kein Text*|
|  | 4. Text nach dem Eingabefeld|*kein Text*|
|  | Achtung: Als Wert der Variablen wird 'true' oder '' (leer) gespeichert.||
| `multiple-choice` oder `drop-down`| 1. Name der Variablen, in die die Eingabe gespeichert werden soll | *Angabe ist erforderlich*|
|  | 2. Pflichtfeld: `0`=nein, `1`=ja|`0`|
|  | 3. Text vor der Optionsliste (Eingabeaufforderung)|*kein Text*|
|  | 4. Liste der Optionen, jeweils getrennt durch `##`|*keine*|
|  | Achtung: Als Wert der Variablen wird die Position der gewählten Option gespeichert, beginnend mit `1`.||

#### Beispiele
```
checkbox::task162ahmfF::0::Sie fühlen sich beunruhigt
multiple-choice::task3wtrtimeS::1::trifft gar nicht zu##trifft eher nicht zu##trifft eher zu##trifft voll zu
```

## Schleifen
`repeat-start` und `repeat-end` markieren einen Block von Elementen, der während der Beantwortung dynamisch 
mehrfach erzeugt wird. Dazu muss die befragte Person eine Zahl eingeben, die die Anzahl der Wiederholungen steuert. 
Alle Variablennamen der im Block befindlichen Eingabeelemente erhalten für den jeweiligen Blockdurchlauf einen  
Suffix: '_' + laufende Nummer des aktuellen Blockdurchlaufes, beginnend mit '_1'.
 
| Schlüsselwort | Parameter | Standardwert |
| :------------- | :------------- | :------------- |
| `repeat-start` | 1. Name der Variablen, in die die Eingabe (Anzahl) gespeichert werden soll | *Angabe ist erforderlich*|
|  | 2. Text vor dem Eingabefeld (Eingabeaufforderung)|*kein Text*|
|  | 3. Text für die Überschrift zu Beginn jeden Blockes (Blocknummer wird jeweils dynamisch dahinter gesetzt)|'Block'|
|  | 4. Maximalwert für die Anzahl der Blöcke|10|
| `repeat-end` | *keine* ||


#### Beispiel
```
rem::Schleife für alle Prüflinge
repeat-start::examineecount::Wie viele Prüflinge gibt es?::Angaben zu Prüfling::20??Sie können Angaben zu maximal 20 Prüflingen eintragen. Sollten sich im Kurs mehr als 20 Prüflinge befinden, ist eine Auswahl vorzunehmen. Diese Auswahl sollte so erfolgen, dass ein möglichst breites Leistungsspektrum abgebildet wird. Vermieden werden sollte eine selektive Berücksichtigung bzw. Nichtberücksichtigung bestimmter Gruppen (z. B. besonders leistungsschwache oder leistungsstarke Prüflinge, Schülerinnen und Schüler mit nichtdeutscher Herkunftssprache).
    input-number::task1::1::Teilaufgabe 1::::0::10
    input-number::task2::1::Teilaufgabe 2::::0::10
    input-number::task3::1::Teilaufgabe 3::::0::10
repeat-end
```
führt z. B. zu folgenden Daten
```
examineecount;3
task1_1;3
task2_1;4
task3_1;5
task1_2;3
task2_2;1
task3_2;5
task1_3;1
task2_3;4
task3_3;6
```

## Ausblenden/Einblenden
`if-start` und `if-end` markieren einen Block von Elementen, der in Abhängigkeit des Wertes einer 
Variablen gezeigt oder ausgeblendet wird. Dabei wird der eingegebene Wert 
mit einem Sollwert verglichen. Mit `if-else` können Elemente ein-/ausgeblendet werden, wenn
der Wert **nicht** mit dem Sollwert übereinstimmt. 
 
| Schlüsselwort | Parameter |
| :------------- | :------------- |
| `if-start` | 1. Name der Variablen, deren Wert geprüft werden soll|
|  | 2. Wert|
| `if-else` | *keine*|
| `if-end` | *keine*|
