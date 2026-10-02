/* =============================================================
   script.js — CORE APPLICATION LOGIC
   =============================================================
   Responsibilities:
     1. Decorate raw nest data with live, date-calculated values.
     2. Render tappable nest summary cards.
     3. Handle real-time search + year + status filtering.
     4. Open / close the animated detail modal.
   Nothing in here needs to be edited by hatchery staff.

   -------------------------------------------------------------
   AUTOMATIC STATUS RULES  (the only thing staff need to know)
   -------------------------------------------------------------
   Status is calculated purely from `layDate` and `hatchedDay`:

     RULE 1 — If `hatchedDay` contains a calendar date (any
              "YYYY-MM-DD" string), the status is ALWAYS "Hatched".
              The incubation day is calculated as the difference
              between `layDate` and `hatchedDay`.

     RULE 2 — Otherwise, if incubation days are 0–50 (inclusive),
              the status is "Incubating".

     RULE 3 — Otherwise, if incubation days are 51–60 (inclusive),
              the status is "Expecting Soon".

   So management only needs to enter the `layDate`. When the
   nest hatches, they set `hatchedDay` to the actual calendar
   date it emerged (e.g. "2026-11-05") and everything else
   updates automatically.
   ============================================================= */

(function () {
  "use strict";

  /* -----------------------------------------------------------
     1. CONFIGURATION
     ----------------------------------------------------------- */

  /* --- Automatic status thresholds (in incubation days) ------ */

  /** Days 0–50 inclusive  → "Incubating"  (Rule 2) */
  var INCUBATING_MAX_DAY = 50;

  /** Days 51–60 inclusive → "Expecting Soon"  (Rule 3) */
  var EXPECTING_SOON_START_DAY = 51;

  /**
   * Day 60 is the end of the normal incubation window.
   * Used ONLY to scale the progress bar on the summary cards.
   * (A nest past day 60 without a recorded hatch date stays
   * "Expecting Soon" until staff record the actual hatch date.)
   */
  var NOMINAL_WINDOW_END_DAY = 60;

  /* --- Misc ------------------------------------------------- */

  var MS_PER_DAY = 86400000;

  var MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  /* -----------------------------------------------------------
     SPECIES LOOKUP TABLE
     -----------------------------------------------------------
     Staff enter a NUMBER in nests.js (species: 1, species: 2),
     which is translated here into the display name and the
     scientific name shown in the detail modal.

     To add a new species in the future, add another entry:

        3: { common: "Olive Ridley Turtle",
             scientific: "Lepidochelys olivacea" },

     (Be sure to update the FIELD GUIDE in nests.js too.)
     ----------------------------------------------------------- */
  var SPECIES_LOOKUP = {
    1: { common: "Green Turtle",     scientific: "Chelonia mydas" },
    2: { common: "Hawksbill Turtle", scientific: "Eretmochelys imbricata" }
  };

  /** Shown if staff enter an unrecognised species code. */
  var SPECIES_FALLBACK = { common: "Unknown species", scientific: "" };

  /* -----------------------------------------------------------
     2. DOM REFERENCES
     ----------------------------------------------------------- */

  var els = {
    grid: document.getElementById("nestGrid"),
    emptyState: document.getElementById("emptyState"),
    clearFiltersBtn: document.getElementById("clearFiltersBtn"),
    resultCount: document.getElementById("resultCount"),
    search: document.getElementById("searchInput"),
    year: document.getElementById("yearFilter"),
    status: document.getElementById("statusFilter"),
    adoption: document.getElementById("adoptionFilter"),   // ← NEW
    overlay: document.getElementById("modalOverlay"),
    modal: document.getElementById("nestModal"),
    modalClose: document.getElementById("modalClose"),
    modalTitle: document.getElementById("modalTitle"),
    modalBadge: document.getElementById("modalBadge"),
    modalBody: document.getElementById("modalBody"),
    footerYear: document.getElementById("footerYear")
  };

  /* -----------------------------------------------------------
     3. DATE HELPERS
     ----------------------------------------------------------- */

  /**
   * Parse a "YYYY-MM-DD" string into a LOCAL Date at midnight.
   * (Avoids the UTC-parsing pitfall of `new Date("2026-08-15")`,
   * which can shift a day backwards in western time zones.)
   */
  function parseISODate(iso) {
    var parts = String(iso).split("-");
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  /** True only if `d` is a real, valid Date object. */
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d.getTime());
  }

  /**
   * Parse a raw `hatchedDay` value from nests.js.
   * Returns a valid Date object, or null if the value is
   * missing / blank / malformed.
   */
  function parseHatchDate(rawHatchedDay) {
    if (
      rawHatchedDay === null ||
      rawHatchedDay === undefined ||
      rawHatchedDay === ""
    ) {
      return null;
    }

    var parsed = parseISODate(rawHatchedDay);
    return isValidDate(parsed) ? parsed : null;
  }

  /** Today's date, normalised to local midnight. */
  function today() {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  /** Whole days between two midnight-normalised dates. */
  function daysBetween(from, to) {
    return Math.round((to.getTime() - from.getTime()) / MS_PER_DAY);
  }

  /** Returns a new Date offset by `n` days. */
  function addDays(date, n) {
    var d = new Date(date.getTime());
    d.setDate(d.getDate() + n);
    return d;
  }

  /** "12 August 2026" */
  function formatLongDate(date) {
    return date.getDate() + " " + MONTHS[date.getMonth()] + " " + date.getFullYear();
  }

  /* -----------------------------------------------------------
     4. AUTOMATIC STATUS CALCULATION
     ----------------------------------------------------------- */

  /**
   * THE CORE STATUS ENGINE.
   *
   * Applies the three rules in strict order, so the outcome is
   * fully determined by `layDate` and `hatchedDay` alone.
   *
   * @param  {boolean} hasHatched   True if a valid hatch date exists.
   * @param  {number}  elapsedDays  Whole days since layDate.
   * @return {string} "Hatched" | "Incubating" | "Expecting Soon"
   */
  function resolveStatus(hasHatched, elapsedDays) {
    /* RULE 1 — a recorded hatch date always wins. */
    if (hasHatched) {
      return "Hatched";
    }

    /* RULE 2 — days 0 to 50 inclusive. */
    if (elapsedDays <= INCUBATING_MAX_DAY) {
      return "Incubating";
    }

    /* RULE 3 — days 51 to 60 inclusive.
       Anything beyond day 60 with no recorded hatch date stays
       "Expecting Soon" (i.e. overdue) until staff record it. */
    return "Expecting Soon";
  }

  /* -----------------------------------------------------------
     5. NEST DECORATION (live calculations)
     ----------------------------------------------------------- */

  /**
   * Add computed fields (prefixed with "_") to a raw nest object.
   * These are what the UI actually renders. Everything here is
   * recalculated from scratch on every page load, so the portal
   * updates itself each day without any manual edits.
   */
  function decorateNest(rawNest) {
    var layDate = parseISODate(rawNest.layDate);

    /* Days since laying (never negative). */
    var elapsed = daysBetween(layDate, today());
    if (elapsed < 0) elapsed = 0;

    /* --- Hatch date handling (Rule 1) ------------------------ */
    var hatchDate = parseHatchDate(rawNest.hatchedDay);
    var hasHatched = hatchDate !== null;

    /* Exact incubation day the nest hatched, calculated as the
       difference between layDate and the recorded hatch date. */
    var hatchedDayNumber = null;
    if (hasHatched) {
      hatchedDayNumber = daysBetween(layDate, hatchDate);
      if (hatchedDayNumber < 0) hatchedDayNumber = 0; // guard bad data
    }

    var speciesInfo = getSpeciesInfo(rawNest.species);

    return {
      id: rawNest.id,
      year: rawNest.year,
      species: speciesInfo.common,      // display name for cards / search
      _speciesCode: rawNest.species,    // raw numeric code for the modal
      eggCount: rawNest.eggCount,
      adopter: rawNest.adopter || null,

      /* --- live, auto-calculated fields --- */
      _layDate: layDate,
      _days: elapsed,
      _hatchDate: hatchDate,            // Date object or null
      _hatchedDay: hatchedDayNumber,    // calculated number or null
      _status: resolveStatus(hasHatched, elapsed),
      _windowStart: addDays(layDate, EXPECTING_SOON_START_DAY),
      _windowEnd: addDays(layDate, NOMINAL_WINDOW_END_DAY)
    };
  }

  /* -----------------------------------------------------------
     6. SMALL UTILITIES
     ----------------------------------------------------------- */

  function escapeHtml(value) {
    return String(value === null || value === undefined ? "" : value).replace(
      /[&<>"']/g,
      function (char) {
        return {
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;"
        }[char];
      }
    );
  }

  /** Lowercase and strip spaces / hashes so "Nest #1" === "nest1". */
  function normalize(str) {
    return String(str === null || str === undefined ? "" : str)
      .toLowerCase()
      .replace(/[#\s]/g, "");
  }

  function statusClass(status) {
    if (status === "Hatched") return "badge--hatched";
    if (status === "Expecting Soon") return "badge--expecting";
    return "badge--incubating";
  }

  /** "Day 42" for active nests, or "Hatched at Day 54". */
  function incubationLabel(nest) {
    if (nest._status === "Hatched") {
      var day = nest._hatchedDay !== null ? nest._hatchedDay : nest._days;
      return "Hatched at Day " + day;
    }
    return "Day " + nest._days;
  }

  /**
   * Translate a numeric species code from nests.js into the
   * full species object used by the UI.
   *
   *   1 → Green Turtle (Chelonia mydas)
   *   2 → Hawksbill Turtle (Eretmochelys imbricata)
   *
   * Anything unrecognised returns a safe fallback instead of
   * throwing, so a typo in nests.js can never break the page.
   */
  function getSpeciesInfo(code) {
    return SPECIES_LOOKUP[code] || SPECIES_FALLBACK;
  }

  /* -----------------------------------------------------------
     7. BUILD THE DATASET
     ----------------------------------------------------------- */

  var allNests = [];

  function buildDataset() {
    if (typeof nestsData === "undefined" || !Array.isArray(nestsData)) {
      els.grid.innerHTML =
        '<p class="empty-state is-visible">Nest data could not be loaded. ' +
        "Please check that <strong>nests.js</strong> is present.</p>";
      return;
    }

    allNests = nestsData.map(decorateNest);

    // Newest season first, then most recently laid first.
    allNests.sort(function (a, b) {
      if (b.year !== a.year) return b.year - a.year;
      return b._layDate.getTime() - a._layDate.getTime();
    });
  }

  /** Fast lookup by nest id for modal opening. */
  function findNestById(id) {
    for (var i = 0; i < allNests.length; i++) {
      if (allNests[i].id === id) return allNests[i];
    }
    return null;
  }

  /* -----------------------------------------------------------
     8. YEAR FILTER POPULATION
     ----------------------------------------------------------- */

  function populateYearFilter() {
    var seen = {};
    var years = [];

    allNests.forEach(function (nest) {
      if (!seen[nest.year]) {
        seen[nest.year] = true;
        years.push(nest.year);
      }
    });

    years.sort(function (a, b) {
      return b - a;
    });

    // Keep the existing "All Years" option, rebuild the rest.
    els.year.innerHTML = '<option value="all">All Years</option>';

    years.forEach(function (year) {
      var option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      els.year.appendChild(option);
    });
  }

  /* -----------------------------------------------------------
     9. CARD RENDERING
     ----------------------------------------------------------- */

  function cardHTML(nest) {
    var percent =
      nest._status === "Hatched"
        ? 100
        : Math.min(
            100,
            Math.round((nest._days / NOMINAL_WINDOW_END_DAY) * 100)
          );

    var adopterText = nest.adopter
      ? "Adopted by " + escapeHtml(nest.adopter)
      : "Available for adoption";

    return (
      '<article class="nest-card" ' +
      'data-nest-id="' + escapeHtml(nest.id) + '" ' +
      'data-status="' + escapeHtml(nest._status) + '" ' +
      'tabindex="0" role="button" ' +
      'aria-label="' + escapeHtml(nest.id) + ", " + escapeHtml(nest.species) +
      ", " + escapeHtml(nest._status) + ". Tap for details." + '">' +

        '<div class="nest-card__top">' +
          '<h3 class="nest-card__id">' + escapeHtml(nest.id) + "</h3>" +
          '<span class="badge ' + statusClass(nest._status) + '">' +
            escapeHtml(nest._status) +
          "</span>" +
        "</div>" +

        '<p class="nest-card__species">' + escapeHtml(nest.species) + "</p>" +

        '<div class="nest-card__meta">' +
          '<span class="nest-card__days">' + escapeHtml(incubationLabel(nest)) + "</span>" +
          '<span class="nest-card__sep" aria-hidden="true">•</span>' +
          "<span>" + escapeHtml(nest.eggCount) + " eggs</span>" +
        "</div>" +

        '<div class="progress" aria-hidden="true">' +
          '<span class="progress__bar" style="width:' + percent + '%"></span>' +
        "</div>" +

        '<div class="nest-card__footer">' +
          '<span class="nest-card__adopter">' + adopterText + "</span>" +
          '<span class="nest-card__hint">Tap for details ' +
            '<span aria-hidden="true">›</span></span>' +
        "</div>" +

      "</article>"
    );
  }

  function renderGrid(nests) {
    if (!nests.length) {
      els.grid.innerHTML = "";
      els.grid.hidden = true;
      els.emptyState.classList.add("is-visible");
      return;
    }

    els.grid.hidden = false;
    els.emptyState.classList.remove("is-visible");

    var html = "";
    for (var i = 0; i < nests.length; i++) {
      html += cardHTML(nests[i]);
    }
    els.grid.innerHTML = html;
  }

  function updateResultCount(shown, total) {
    if (!total) {
      els.resultCount.textContent = "";
      return;
    }
    if (shown === total) {
      els.resultCount.textContent =
        "Showing all " + total + " nest" + (total === 1 ? "" : "s");
    } else {
      els.resultCount.textContent =
        "Showing " + shown + " of " + total + " nests";
    }
  }

  /* -----------------------------------------------------------
     10. FILTERING
     ----------------------------------------------------------- */

  /**
   * A nest matches the query if the normalised query appears in
   * any of its searchable tokens. Extra tokens such as "nest 1"
   * make zero-padded IDs searchable as "Nest #1" or "nest 1".
   */
  function matchesQuery(nest, normalizedQuery) {
    var digits = String(nest.id).replace(/\D/g, ""); // "01"
    var numeric = digits ? String(Number(digits)) : ""; // "1"

    var tokens = [
      nest.id,                        // "Nest #01"
      digits,                         // "01"
      numeric,                        // "1"
      "nest " + numeric,              // "nest 1"
      nest.adopter || "",             // "John Doe"
      nest.species || "",             // "Green Turtle"
      String(nest.year)               // "2026"
    ];

    for (var i = 0; i < tokens.length; i++) {
      if (normalize(tokens[i]).indexOf(normalizedQuery) !== -1) {
        return true;
      }
    }
    return false;
  }

  function applyFilters() {
    var query = normalize(els.search.value);
    var yearValue = els.year.value;
    var statusValue = els.status.value;
    var adoptionValue = els.adoption.value;

    var filtered = allNests.filter(function (nest) {
      if (yearValue !== "all" && String(nest.year) !== yearValue) return false;
      if (statusValue !== "all" && nest._status !== statusValue) return false;

      /* --- Adoption availability filter ---
         "available" → nests with no adopter
         "adopted"   → nests that have an adopter       */
      if (adoptionValue === "available" && nest.adopter) return false;
      if (adoptionValue === "adopted" && !nest.adopter) return false;

      if (query && !matchesQuery(nest, query)) return false;
      return true;
    });

    renderGrid(filtered);
    updateResultCount(filtered.length, allNests.length);
  }

  function clearFilters() {
    els.search.value = "";
    els.year.value = "all";
    els.status.value = "all";
    els.adoption.value = "all";   // ← NEW
    applyFilters();
    els.search.focus();
  }

  /* -----------------------------------------------------------
     11. DETAIL MODAL
     ----------------------------------------------------------- */

  var lastFocusedElement = null;

  function detailRow(label, valueHtml, modifier) {
    return (
      '<div class="detail-row' + (modifier ? " " + modifier : "") + '">' +
        "<dt>" + label + "</dt>" +
        "<dd>" + valueHtml + "</dd>" +
      "</div>"
    );
  }

  function buildModalBody(nest) {
    /* Translate the numeric species code stored on the raw nest
       into the full species object for display. */
    var species = getSpeciesInfo(nest._speciesCode);
    var rows = "";

    // --- Headline: days in incubation -------------------------
    rows += detailRow(
      "Days in Incubation",
      escapeHtml(incubationLabel(nest)),
      "detail-row--highlight"
    );

    // --- Identity ---------------------------------------------
    rows += detailRow("Nest ID / Number", escapeHtml(nest.id));

    var speciesHtml =
      escapeHtml(species.common) +
      (species.scientific
        ? '<span class="sci">(' + escapeHtml(species.scientific) + ")</span>"
        : "");
    rows += detailRow("Turtle Species", speciesHtml);

    // --- Dates ------------------------------------------------
    rows += detailRow(
      "Date Laid (Start of Incubation)",
      escapeHtml(formatLongDate(nest._layDate))
    );

    if (nest._status === "Hatched" && nest._hatchDate) {
      rows += detailRow(
        "Hatch Date",
        escapeHtml(formatLongDate(nest._hatchDate))
      );
      rows += detailRow(
        "Incubation Day at Hatch",
        "Day " + escapeHtml(nest._hatchedDay)
      );
    } else {
      rows += detailRow(
        "Estimated Hatch Window",
        escapeHtml(
          formatLongDate(nest._windowStart) +
            " – " +
            formatLongDate(nest._windowEnd)
        )
      );
    }

    // --- Clutch & status --------------------------------------
    rows += detailRow(
      "Total Eggs Incubated",
      escapeHtml(nest.eggCount) + " pieces"
    );

    rows += detailRow(
      "Nest Status",
      '<span class="badge ' + statusClass(nest._status) + '">' +
        escapeHtml(nest._status) +
      "</span>"
    );

    // --- Adoption ---------------------------------------------
    rows += detailRow(
      "Adopted By",
      nest.adopter
        ? "Adopted by " + escapeHtml(nest.adopter)
        : '<span class="muted">Available for Adoption</span>'
    );

    return '<dl class="detail-list">' + rows + "</dl>";
  }

  function openModal(nest) {
    lastFocusedElement = document.activeElement;

    els.modalTitle.textContent = nest.id;
    els.modalBadge.textContent = nest._status;
    els.modalBadge.className = "badge " + statusClass(nest._status);
    els.modalBody.innerHTML = buildModalBody(nest);

    els.overlay.classList.add("is-open");
    els.overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");

    // Focus the close button so keyboard / screen-reader users land inside.
    window.requestAnimationFrame(function () {
      els.modalClose.focus();
    });
  }

  function closeModal() {
    els.overlay.classList.remove("is-open");
    els.overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
    lastFocusedElement = null;
  }

  function isModalOpen() {
    return els.overlay.classList.contains("is-open");
  }

  /* -----------------------------------------------------------
     12. EVENT WIRING
     ----------------------------------------------------------- */

  function bindEvents() {
    // --- Live filtering ---------------------------------------
    els.search.addEventListener("input", applyFilters);
    els.year.addEventListener("change", applyFilters);
    els.status.addEventListener("change", applyFilters);
    els.adoption.addEventListener("change", applyFilters);   // ← NEW
    els.clearFiltersBtn.addEventListener("click", clearFilters);

    // --- Card interaction (event delegation) -------------------
    els.grid.addEventListener("click", function (event) {
      var card = event.target.closest(".nest-card");
      if (!card) return;
      var nest = findNestById(card.getAttribute("data-nest-id"));
      if (nest) openModal(nest);
    });

    els.grid.addEventListener("keydown", function (event) {
      if (event.key !== "Enter" && event.key !== " " && event.key !== "Spacebar") {
        return;
      }
      var card = event.target.closest(".nest-card");
      if (!card) return;
      event.preventDefault();
      var nest = findNestById(card.getAttribute("data-nest-id"));
      if (nest) openModal(nest);
    });

    // --- Modal closing ----------------------------------------
    els.modalClose.addEventListener("click", closeModal);

    // Tap outside the card to close
    els.overlay.addEventListener("click", function (event) {
      if (event.target === els.overlay) closeModal();
    });

    // Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isModalOpen()) closeModal();
    });

    // Simple focus trap while the modal is open
    els.overlay.addEventListener("keydown", function (event) {
      if (event.key !== "Tab" || !isModalOpen()) return;

      var focusables = els.modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  /* -----------------------------------------------------------
     13. INITIALISE
     ----------------------------------------------------------- */

  function init() {
    if (els.footerYear) {
      els.footerYear.textContent = String(new Date().getFullYear());
    }

    buildDataset();
    populateYearFilter();
    bindEvents();
    applyFilters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();