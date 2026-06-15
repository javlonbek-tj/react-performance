# Performance Profiling Report

## Environment

- React version: 19.2
- Browser: Chrome 148
- Tool: React DevTools Profiler

---

## 1. Sorting Countries

**Commit Duration:** 2.7s  
**Render Duration:** 448 ms

### Screenshots

![Sort Summary](./src/screenshots/sort-summary.png)

![Sort Flame Chart](./src/screenshots/sort-flamechart.png)

### Findings

- Component YearSelector re-rendered unnecessarily
- Every single CountryCard re-rendered

---

## 2. Searching for a Country

**Commit Duration:** 2.3 s  
**Render Duration:** 233 ms

### Screenshots

![Sort Summary](./src/screenshots/search-summary.png)

![Sort Flame Chart](./src/screenshots/search-flamechart.png)

### Findings

- Every keystroke triggers a full re-render of all rows
- Component YearSelector re-rendered unnecessarily

---

## 3. Selecting a Different Year

**Commit Duration:** 3.2 s  
**Render Duration:** 514 ms

### Screenshots

![Sort Summary](./src/screenshots/year-summary.png)

![Sort Flame Chart](./src/screenshots/year-flamechart.png)

### Findings

- Every single CountryCard re-rendered

---

## 4. Toggling Columns

**Commit Duration:** 1.6 s  
**Render Duration:** 478 ms

### Screenshots

![Sort Summary](./src/screenshots/toggle-summary.png)

![Sort Flame Chart](./src/screenshots/toggle-flamechart.png)

### Findings

- Component YearSelector re-rendered unnecessarily
- Every single CountryCard re-rendered
