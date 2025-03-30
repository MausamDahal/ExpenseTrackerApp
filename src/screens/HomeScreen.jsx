import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useStore from '../store/useStore';
import { getExpenses } from '../firebase/firebaseService';
import { useTheme } from '../theme/ThemeContext'; // Import the useTheme hook

export default function HomeScreen() {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);
  const expenses = useStore((state) => state.expenses);
  const setExpenses = useStore((state) => state.setExpenses);
  const setSelectedExpense = useStore((state) => state.setSelectedExpense);
  const { theme } = useTheme(); // Get the current theme from context

  useEffect(() => {
    const fetchExpenses = async () => {
      if (user?.uid) {
        const data = await getExpenses(user.uid);
        setExpenses(data);
      }
    };
    fetchExpenses();
  }, [user]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]} // Apply theme dynamically
      onPress={() => {
        setSelectedExpense(item);
        navigation.navigate('AddExpense');
      }}
    >
      <Text style={[styles.title, { color: theme.textPrimary }]}>
        {item.title}
      </Text>
      <Text style={[styles.amount, { color: theme.primary }]}>
        ${item.amount}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.textPrimary }]}>💸 Your Expenses</Text>

        {/* Directly use FlatList instead of wrapping in ScrollView */}
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: theme.textMuted }]}>
              No expenses added yet.
            </Text>
          }
        />

        <View style={styles.buttonGroup}>
          <Pressable
            style={[styles.primaryButton, { backgroundColor: theme.primary }]}
            onPress={() => {
              setSelectedExpense(null);
              navigation.navigate('AddExpense');
            }}
          >
            <Text style={styles.buttonText}>➕ Add New Expense</Text>
          </Pressable>

          <Pressable
            style={[styles.primaryButton, styles.secondaryButton]}
            onPress={() => navigation.navigate('Summary')}
          >
            <Text style={[styles.buttonText, { color: theme.textPrimary }]}>
              📊 View Summary
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  card: {
    padding: 18,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 6,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: 30,
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
