# Specification & Requirements: Income Awareness Browser Plugin

## 1. Scope & Goals

- **Purpose**: To enhance users' perception of online prices by showing what percentage a given monetary amount (e.g., price, fee) represents relative to their income.
- **Target Platforms**: Browser-agnostic (must support Chrome, Firefox, Edge, Safari, etc.).
- **Core Use Cases**: Identifying price amounts on web pages (shopping and non-shopping), calculating and displaying the percentage inline according to user-configurable preferences.

## 2. User Configuration

### 2.1. Income Parameters

- **Income Input Options**:
  - Annual Salary
  - Monthly Salary
  - Hourly Rate
- **Input Validation**:
  - Only one input is required, with clear calculation rules (see Calculations) for conversion between units.
  - Optionally, allow setting multiple (e.g., both annual and hourly), but require one as primary.

### 2.2. Working Parameters

- **Workweek Definition**: (relevant for hourly calculation)
  - Configurable: hours per week, weeks per year (defaults to 40 hours/week, 52 weeks/year).
- **Currency Display**: Respect the detected or user-configured currency; ensure calculations are currency-agnostic.

### 2.3. Font & Inline Display Customization

- Font family (dropdown, with custom option)
- Font size (slider/input)
- Font color (color picker)
- Font weight/style (normal/bold/italic/underline)
- Parenthetical option: always show as (X%), optionally display explicit "of your annual/monthly/hourly income"

### 2.4. Selector & Site Controls

- User-configurable rules for:
  - Enabling/disabling plugin per domain/site
  - Excluding or including specific page types or CSS selectors

### 2.5. Future-Proofing for Budgets

- Option to (in future versions) add and select budgets for various spending categories.
- UI placeholder for entering/selecting budgets.
- Underlying architecture must separate "Income" and "Budget" as distinct but related sources for percentage calculation.

## 3. Functionality

### 3.1. Price Detection

- Use robust regular expressions and locale-aware pattern matching to find currency or price mentions in page text.
- Allow site-specific or selector-based overrides for detection rules.
- Avoid double-counting when a price appears in multiple elements.

### 3.2. Inline Percentage Injection

- After identifying a price, calculate the percentage relative to the relevant user income figure.
- Insert display within parentheses after the price following configuration (e.g., "$18.00 (0.04% of your monthly income)").
- Must not disrupt page layout or break interactive elements.
- Support live DOM changes (e.g., infinite scroll).

### 3.3. Configuration UI

- Accessible via browser extension toolbar (popup modal or options page).
- Responsive and accessible design.
- Live preview for font/display configuration.
- Clear instructions regarding income entry, privacy, and how the calculation is performed.

### 3.4. Storage & Privacy

- Use browser storage APIs (sync/local as appropriate) for configuration.
- No user income or browsing data may be sent off-device.
- Compliance with browser extension store policies (data privacy, content scripts).

### 3.5. Extensibility for Budgets

- Codebase structured such that future budget modules can be plugged in:
  - Income vs. Budget are separate calculation classes/functions.
  - All UI and data storage treats budgets as optional fields, clearly separated from income.
  - API (internal) designed to accept "reference amount" (income, budget, or other), with clear interfaces/contracts.

## 4. Calculations

- **Percent Formula**:
  ```
  percentage = (price / reference income) × 100
  ```
  - reference income is annual, monthly, or hourly as configured (see conversion rules).
- Income conversions:
  - Annual <-> Monthly: divide/multiply by 12.
  - Annual <-> Hourly, Monthly <-> Hourly: use user-defined or default workweek and weeks per year.
  - Validate and handle edge cases (zero or missing input).

## 5. Non-Functional Requirements

- **Performance**: Must not cause perceptible lag on large or complex web pages.
- **Compatibility**: Tested in latest and two previous versions of major browsers.
- **Accessibility**: All injected UI respects page accessibility (ARIA, color contrast).
- **Security**: Defend against script injection/vulnerabilities in content scripts.
- **Upgradeability**: All user data preserved across updates.

## 6. Extensibility & Future Requirements

- Budgets: User can set budgets per category, and plugin displays % of budget instead of (or in addition to) % of income.
- API for integrating additional reference points (e.g., shared household income, savings goals).

## 7. Deliverables

- **Extension Manifest**: Browser-agnostic, following Manifest V3 or equivalent.
- **Content Scripts & Injection Logic**: Modular, extensible, with clear interfaces.
- **Configuration UI**: Fully functional and visually consistent across browsers.
- **Readme**: Describing installation, configuration, privacy, and future budget capabilities.
- **Developer Documentation**: Specs for how to extend for budget features.

---

**End of Specification**