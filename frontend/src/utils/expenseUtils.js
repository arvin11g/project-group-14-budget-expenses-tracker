export function splitExpenses(expenses) {
  const planned = expenses.filter((e) => e.type === "PLANNED");
  const actual = expenses.filter((e) => e.type === "ACTUAL" || !e.type);

  return { planned, actual };
}

export function calculateExpenseTotal(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}