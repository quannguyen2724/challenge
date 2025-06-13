# React Code Analysis: Issues & Solutions

## 🚩 1. Performance Issues

- **Redundant `useMemo` Dependency**: `prices` is included as a dependency but is not used within the `sortedBalances` calculation, causing unnecessary re-computations.
  - **Solution**: Remove `prices` from the dependency array.
- **Unnecessary Function Recreation**: The `getPriority` function is redefined on every component render.
  - **Solution**: Move `getPriority` outside the component. Using an object for lookup is also more performant.
- **Multiple Array Iterations**: The code iterates through the array four times (`filter`, `sort`, `map`, `map`) to process and display data.
  - **Solution**: Chain the processing steps within `useMemo` and use only a single `.map()` for rendering, eliminating the intermediate array.

## 🚩 2. Anti-patterns & Logical Bugs

- **Using `index` as a `key`**: Using an array index as a `key` for components is a critical anti-pattern that causes rendering bugs when the list is re-ordered.
  - **Solution**: Use a **unique and stable** identifier from the data itself, such as `balance.currency`.
- **Logical Bug in `.filter()`**: The code uses a non-existent `lhsPriority` variable and has flawed logic that keeps balances with `amount <= 0`.
  - **Solution**: Fix the variable name and adjust the logic to filter for balances with a valid priority and a positive amount.
- **TypeScript Error**: The code maps over `sortedBalances` (an array of `WalletBalance[]`) but attempts to access the non-existent `balance.formatted` property.
  - **Solution**: Remove the intermediate `formattedBalances` array and format the value directly during the render map.
