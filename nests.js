/* =============================================================
   nests.js — NEST DATA SOURCE  (SAFE FOR NON-TECHNICAL STAFF)
   =============================================================

   This is the ONLY file you need to edit to keep the portal
   up to date. You do not need to touch any other file.

   =============================================================
   QUICK START — THE ONLY THREE THINGS YOU EVER NEED TO EDIT
   =============================================================

   • layDate      → the date the eggs were laid
   • hatchedDay   → the date the hatchlings emerged
                    (leave as `null` until it actually hatches)
   • species      → a number: 1 for Green, 2 for Hawksbill

   Everything else on the portal — status badges, "Day X"
   counters, "Expecting Soon" warnings, the progress bar, and
   the hatch-day calculation — is worked out automatically
   from those dates. You never type a status or a day number.

   =============================================================
   HOW TO ADD A NEW NEST
   =============================================================
   1. Copy one whole block, from the opening  {  to the closing  },
   2. Paste it at the TOP of the list below (newest nests first).
   3. Fill in the values (see FIELD GUIDE at the bottom).
      For a brand-new nest, always set:

          hatchedDay: null

   4. Save the file and refresh the portal page.

   =============================================================
   HOW TO RECORD A NEST THAT HAS JUST HATCHED
   =============================================================
   1. Find the nest in the list.
   2. Change this line:

          hatchedDay: null

      to the ACTUAL CALENDAR DATE the hatchlings emerged:

          hatchedDay: "2026-11-05"

      ⚠ Use the format  "YYYY-MM-DD"
         (year dash month dash day — always two digits for
          month and day, wrapped in double quotes).

   3. Save and refresh.

   That's the entire job. The portal will automatically:
     ✔ Switch the status badge to "Hatched"
     ✔ Calculate the exact incubation day it hatched
       (e.g. "Hatched at Day 54")
     ✔ Show the hatch date in the pop-up details
     ✔ Fill the progress bar to 100%

   =============================================================
   AUTOMATIC STATUS RULES  (for your reference)
   =============================================================
   You do NOT set the status yourself. It is calculated from
   the two dates using these three rules, in this order:

     RULE 1 — If `hatchedDay` contains a calendar date,
              the status is ALWAYS "Hatched".

     RULE 2 — Otherwise, if incubation days are 0–50,
              the status is "Incubating".

     RULE 3 — Otherwise, if incubation days are 51–60,
              the status is "Expecting Soon".

   A nest past day 60 with no recorded hatch date stays as
   "Expecting Soon" (i.e. overdue) until you enter the date.

   =============================================================
   FIELD GUIDE
   =============================================================
   id          The nest label shown on the card.
               Keep the format  "Nest #01", "Nest #02", …
               (always two digits, in double quotes).

   year        Nesting season year, as a plain number
               (no quotes), e.g.  2026
               This drives the "Year" filter dropdown.

   species     ⚠ USE A NUMBER — do not type the name.
               The number is translated to a full species
               name (with scientific name) by the portal.

                  1  =  Green Turtle
                  2  =  Hawksbill Turtle

               Example:   species: 1,
               (A plain number, no quotes. Much less prone
               to typos than spelling the name.)

   layDate     The date the eggs were laid, as a calendar
               date string in the format  "YYYY-MM-DD"
               e.g.  "2026-08-15"
               ⚠ This drives the automatic "Day X" counter
                 and the "Expecting Soon" warning.

   eggCount    Total number of eggs incubated.
               A whole number, no quotes.  e.g.  112

   hatchedDay  The ACTUAL CALENDAR DATE the nest hatched.
               • Still incubating →  null
               • Has hatched      →  "YYYY-MM-DD"
                 e.g.  "2026-11-05"
               ⚠ Setting a date here automatically switches
                 the status to "Hatched" and calculates the
                 exact incubation day. No day number needed.

   adopter     Name of the adopting guest / family / company,
               in double quotes.
               Use  null  (no quotes) if the nest is still
               available for adoption.

   ============================================================= */

const nestsData = [
  {
    id: "Nest #394",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-30",
    eggCount: 97,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #393",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-30",
    eggCount: 82,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #392",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-29",
    eggCount: 96,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #391",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-28",
    eggCount: 58,
    hatchedDay: null,         // still incubating
    adopter: "Viktoria Lantrat & Sergei Plotnikov"
  },
  {
    id: "Nest #390",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-27",
    eggCount: 81,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #389",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-26",
    eggCount: 98,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #388",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-25",
    eggCount: 44,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #387",
    year: 2026,
    species: 2,               // 2 = Hawksbill Turtle
    layDate: "2026-09-26",
    eggCount: 129,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #386",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-23",
    eggCount: 67,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #385",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-22",
    eggCount: 105,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #384",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-22",
    eggCount: 102,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #383",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-22",
    eggCount: 74,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #382",
    year: 2026,
    species: 2,               // 2 = Hawksbill Turtle
    layDate: "2026-09-21",
    eggCount: 144,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #381",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-21",
    eggCount: 68,
    hatchedDay: null,         // still incubating
    adopter: null
  },
{
    id: "Nest #380",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-20",
    eggCount: 97,
    hatchedDay: null,         // still incubating
    adopter: null
  },
{
    id: "Nest #379",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-17",
    eggCount: 80,
    hatchedDay: null,         // still incubating
    adopter: null
  },
{
    id: "Nest #378",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-17",
    eggCount: 61,
    hatchedDay: null,         // still incubating
    adopter: null
  },
{
    id: "Nest #377",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-15",
    eggCount: 131,
    hatchedDay: null,         // still incubating
    adopter: "Lyyn"
  },
  {
    id: "Nest #376",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-15",
    eggCount: 37,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #375",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-12",
    eggCount: 100,
    hatchedDay: null,         // still incubating
    adopter: "Jocelyn Morris & Scott Morris"
  },
  {
    id: "Nest #374",
    year: 2026,
    species: 2,               // 2 = Hawksbill Turtle
    layDate: "2026-09-12",
    eggCount: 147,
    hatchedDay: null,         // still incubating
    adopter: "Michelle Wong"
  },
  {
    id: "Nest #373",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-12",
    eggCount: 121,
    hatchedDay: null,         // still incubating
    adopter: "Charlotte Wiggins"
  },
  {
    id: "Nest #372",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-12",
    eggCount: 95,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #371",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-11",
    eggCount: 117,
    hatchedDay: null,         // still incubating
    adopter: "Michelle Cates"
  },
  {
    id: "Nest #370",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-11",
    eggCount: 51,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #369",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-9",
    eggCount: 85,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #368",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-9",
    eggCount: 117,
    hatchedDay: null,         // still incubating
    adopter: "David Todd"
  },
  {
    id: "Nest #367",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-9",
    eggCount: 114,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #366",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-9",
    eggCount: 101,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #365",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-9",
    eggCount: 95,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #364",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-9",
    eggCount: 127,
    hatchedDay: null,         // still incubating
    adopter: "Michael Cates"
  },
  {
    id: "Nest #363",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-8",
    eggCount: 81,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #362",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-8",
    eggCount: 63,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #361",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-8",
    eggCount: 38,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #360",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-6",
    eggCount: 98,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #359",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-6",
    eggCount: 54,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #358",
    year: 2026,
    species: 2,               // 2 = hawksbill Turtle
    layDate: "2026-09-4",
    eggCount: 111,
    hatchedDay: null,         // still incubating
    adopter: "Dania Sigrist"
  },
  {
    id: "Nest #357",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-3",
    eggCount: 94,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #356",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-3",
    eggCount: 86,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #355",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-1",
    eggCount: 106,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #354",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-1",
    eggCount: 89,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #353",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-1",
    eggCount: 72,
    hatchedDay: null,         // still incubating
    adopter: "Ulli & Julia"
  },
  {
    id: "Nest #352",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-1",
    eggCount: 73,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #351",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-1",
    eggCount: 57,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #350",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-1",
    eggCount: 85,
    hatchedDay: null,         // still incubating
    adopter: null
  },
  {
    id: "Nest #349",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-09-1",
    eggCount: 87,
    hatchedDay: null,         // still incubating
    adopter: null
  },
    {
    id: "Nest #348",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-31",
    eggCount: 106,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #347",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-30",
    eggCount: 108,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #346",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-30",
    eggCount: 81,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #345",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-30",
    eggCount: 136,
    hatchedDay: null,         // still incubating
    adopter: "Dania Sigrist"
  },
   {
    id: "Nest #344",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-30",
    eggCount: 63,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #343",
    year: 2026,
    species: 2,               // 2 = Hawksbill Turtle
    layDate: "2026-08-29",
    eggCount: 141,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #342",
    year: 2026,
    species: 2,               // 2 = Hawksbill Turtle
    layDate: "2026-08-29",
    eggCount: 126,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #341",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-29",
    eggCount: 168,
    hatchedDay: null,         // still incubating
    adopter: "Dania Sigrist"
  },
   {
    id: "Nest #340",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-29",
    eggCount: 65,
    hatchedDay: null,         // still incubating
    adopter: "Gavin & Marian"
  },
   {
    id: "Nest #339",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-29",
    eggCount: 107,
    hatchedDay: null,         // still incubating
    adopter: "Jennifer Clarewatton"
  },
   {
    id: "Nest #338",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-29",
    eggCount: 77,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #337",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-28",
    eggCount: 95,
    hatchedDay: null,         // still incubating
    adopter: "Flynn & Freddie"
  },
   {
    id: "Nest #336",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-28",
    eggCount: 65,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #335",
    year: 2026,
    species: 2,               // 2 = Hawksbill Turtle
    layDate: "2026-08-28",
    eggCount: 136,
    hatchedDay: null,         // still incubating
    adopter: "Mirjam Knies"
  },
   {
    id: "Nest #334",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-27",
    eggCount: 105,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #333",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-23",
    eggCount: 108,
    hatchedDay: null,         // still incubating
    adopter: "Viola Bianchi"
  },
 {
    id: "Nest #332",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-23",
    eggCount: 56,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #331",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-23",
    eggCount: 79,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #330",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-21",
    eggCount: 111,
    hatchedDay: null,         // still incubating
    adopter: "Gueldenpfennig"
  },
   {
    id: "Nest #329",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-20",
    eggCount: 89,
    hatchedDay: null,         // still incubating
    adopter: "Yu Ching Ho"
  },
   {
    id: "Nest #328",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-20",
    eggCount: 134,
    hatchedDay: null,         // still incubating
    adopter: "Raye"
  },
   {
    id: "Nest #327",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-20",
    eggCount: 114,
    hatchedDay: null,         // still incubating
    adopter: "Amanda Teoh"
  },
   {
    id: "Nest #326",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-18",
    eggCount: 62,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #325",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-18",
    eggCount: 71,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #324",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-17",
    eggCount: 65,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #323",
    year: 2026,
    species: 2,               // 2 = hawksbill Turtle
    layDate: "2026-08-16",
    eggCount: 182,
    hatchedDay: null,         // still incubating
    adopter: "Nico & James"
  },
   {
    id: "Nest #322",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-15",
    eggCount: 101,
    hatchedDay: null,         // still incubating
    adopter: "Tina Loevdal"
  },
   {
    id: "Nest #321",
    year: 2026,
    species: 2,               // 2 = hawksbill Turtle
    layDate: "2026-08-14",
    eggCount: 157,
    hatchedDay: null,         // still incubating
    adopter: "Belford Tan"
  },
   {
    id: "Nest #320",
    year: 2026,
    species: 2,               // 2 = hawksbill Turtle
    layDate: "2026-08-14",
    eggCount: 134,
    hatchedDay: null,         // still incubating
    adopter: "Lieveke Van Bezouw"
  },
   {
    id: "Nest #319",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-13",
    eggCount: 88,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #318",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-13",
    eggCount: 57,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #317",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-13",
    eggCount: 78,
    hatchedDay: null,         // still incubating
    adopter: "Lisia Orsini"
  },
   {
    id: "Nest #316",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-12",
    eggCount: 99,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #315",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-12",
    eggCount: 100,
    hatchedDay: "2026-10-1",         // still incubating
    adopter: "Sonja Szameit"
  },
   {
    id: "Nest #314",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-12",
    eggCount: 110,
    hatchedDay: null,         // still incubating
    adopter: "Elena Guala'"
  },
   {
    id: "Nest #313",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-12",
    eggCount: 94,
    hatchedDay: null,         // still incubating
    adopter: "Sarah Devlin"
  },
   {
    id: "Nest #312",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-12",
    eggCount: 81,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #311",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-12",
    eggCount: 64,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #310",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-12",
    eggCount: 127,
    hatchedDay: "2026-10-01",         // still incubating
    adopter: "Mirjam Glattli"
  },
   {
    id: "Nest #309",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-11",
    eggCount: 55,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #308",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-11",
    eggCount: 75,
    hatchedDay: "2026-10-01",         // still incubating
    adopter: null
  },
   {
    id: "Nest #307",
    year: 2026,
    species: 2,               // 2 = Hawksbill Turtle
    layDate: "2026-08-11",
    eggCount: 93,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #306",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-10",
    eggCount: 54,
    hatchedDay: null,         // still incubating
    adopter: null
  },
   {
    id: "Nest #305",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-10",
    eggCount: 88,
    hatchedDay: "2026-09-28",         // still incubating
    adopter: null
  },
   {
    id: "Nest #304",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-9",
    eggCount: 56,
    hatchedDay: "2026-10-2",         // still incubating
    adopter: null
  },
   {
    id: "Nest #303",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-8",
    eggCount: 96,
    hatchedDay: "2026-09-28",         // still incubating
    adopter: null
  },
   {
    id: "Nest #302",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-8",
    eggCount: 84,
    hatchedDay: "2026-09-28",         // still incubating
    adopter: null
  },
 {
    id: "Nest #301",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-8",
    eggCount: 88,
    hatchedDay: "2026-09-29",         // still incubating
    adopter: "Harecker Walter"
  },
   {
    id: "Nest #300",
    year: 2026,
    species: 1,               // 1 = Green Turtle
    layDate: "2026-08-7",
    eggCount: 123,
    hatchedDay: "2026-09-29",         // still incubating
    adopter: "Elvira Kerchkoffs"
  }
];