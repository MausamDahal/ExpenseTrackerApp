import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import useStore from '../store/useStore';
import moment from 'moment';
import { useTheme } from '../theme/ThemeContext'; // Import useTheme hook

export default function SummaryScreen() {
  const { theme } = useTheme(); // Get the current theme from context
  const expenses = useStore((state) => state.expenses);
  const currentDate = moment();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.month());
  const [selectedYear, setSelectedYear] = useState(currentDate.year());

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const date = moment(expense.date, 'YYYY-MM-DD');
      return date.month() === selectedMonth && date.year() === selectedYear;
    });
  }, [expenses, selectedMonth, selectedYear]);

  const summary = useMemo(() => {
    let total = 0;
    const categoryTotals = {};
    filteredExpenses.forEach((expense) => {
      const amount = parseFloat(expense.amount);
      total += amount;
      const category = expense.category || 'Uncategorized';
      categoryTotals[category] = (categoryTotals[category] || 0) + amount;
    });
    return { total, categoryTotals };
  }, [filteredExpenses]);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.textPrimary }]}>📊 Monthly Summary</Text>

      <Text style={[styles.label, { color: theme.textPrimary }]}>Select Month</Text>
      <Picker
        selectedValue={selectedMonth}
        onValueChange={setSelectedMonth}
        style={[styles.nativePicker, { backgroundColor: theme.card }]}
      >
        {Array.from({ length: 12 }, (_, i) => (
          <Picker.Item key={i} label={moment().month(i).format('MMMM')} value={i} />
        ))}
      </Picker>

      <Text style={[styles.label, { color: theme.textPrimary }]}>Select Year</Text>
      <Picker
        selectedValue={selectedYear}
        onValueChange={setSelectedYear}
        style={[styles.nativePicker, { backgroundColor: theme.card }]}
      >
        {[2024, 2025, 2026].map((year) => (
          <Picker.Item key={year} label={String(year)} value={year} />
        ))}
      </Picker>

      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <Text style={[styles.totalLabel, { color: theme.textPrimary }]}>Total Spent:</Text>
        <Text style={[styles.totalAmount, { color: theme.primary }]}>${summary.total.toFixed(2)}</Text>
      </View>

      <Text style={[styles.subheader, { color: theme.textPrimary }]}>By Category</Text>
      {Object.entries(summary.categoryTotals).length === 0 ? (
        <Text style={[styles.empty, { color: theme.textMuted }]}>No expenses found for this period.</Text>
      ) : (
        Object.entries(summary.categoryTotals).map(([category, amount]) => (
          <View key={category} style={[styles.row, { borderBottomColor: theme.border }]}>
            <Text style={{ color: theme.textPrimary }}>{category}</Text>
            <Text style={{ color: theme.textPrimary }}>${amount.toFixed(2)}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    marginTop: 10,
  },
  nativePicker: {
    width: '100%',
    marginBottom: 15,
    borderRadius: 10,
  },
  card: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 16,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  subheader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    paddingVertical: 6,
  },
  empty: {
    textAlign: 'center',
    marginTop: 10,
  },
});
