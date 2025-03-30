import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import useStore from '../store/useStore';
import { addExpense, updateExpense, deleteExpense, getExpenses } from '../firebase/firebaseService'; // Ensure getExpenses is available
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext'; // Import useTheme hook

export default function AddExpenseScreen() {
  const navigation = useNavigation();
  const user = useStore((state) => state.user);
  const selectedExpense = useStore((state) => state.selectedExpense);
  const setSelectedExpense = useStore((state) => state.setSelectedExpense);
  const setExpenses = useStore((state) => state.setExpenses); // Access the setExpenses function from your store
  const { theme } = useTheme(); // Access the current theme

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (selectedExpense) {
      setTitle(selectedExpense.title || '');
      setAmount(String(selectedExpense.amount || ''));
      setCategory(selectedExpense.category || '');
      setDate(selectedExpense.date || '');
    }
  }, [selectedExpense]);

  const handleSave = async () => {
    if (!title || !amount || !category || !date) {
      Alert.alert('All fields are required');
      return;
    }

    const expenseData = {
      title,
      amount: parseFloat(amount),
      category,
      date,
    };

    try {
      if (selectedExpense) {
        await updateExpense(selectedExpense.id, expenseData);
        Alert.alert('Expense updated!');
      } else {
        await addExpense(user.uid, expenseData);
        Alert.alert('Expense added!');
      }
      
      // Re-fetch expenses after adding or updating
      const updatedExpenses = await getExpenses(user.uid);
      setExpenses(updatedExpenses); // Update the expenses state with the new data

      setSelectedExpense(null); // Clear the selected expense
      navigation.navigate('Home'); // Navigate back to the Home screen
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense) return;
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this expense?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteExpense(selectedExpense.id);
            Alert.alert('Expense deleted!');
            
            // Re-fetch expenses after deletion
            const updatedExpenses = await getExpenses(user.uid);
            setExpenses(updatedExpenses); // Update the expenses state with the new data

            setSelectedExpense(null); // Clear the selected expense
            navigation.navigate('Home'); // Navigate back to the Home screen
          } catch (error) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.header, { color: theme.textPrimary }]}>
        {selectedExpense ? 'Edit Expense' : 'Add Expense'}
      </Text>

      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={[styles.input, { borderColor: theme.border }]}
      />

      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        style={[styles.input, { borderColor: theme.border }]}
        keyboardType="numeric"
      />

      <TextInput
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
        style={[styles.input, { borderColor: theme.border }]}
      />

      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={[styles.input, { borderColor: theme.border }]}
      />

      <View style={styles.buttonGroup}>
        <Button
          title={selectedExpense ? 'Update Expense' : 'Add Expense'}
          onPress={handleSave}
        />
      </View>

      {selectedExpense && (
        <View style={styles.deleteGroup}>
          <Button title="Delete Expense" color={theme.error} onPress={handleDelete} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonGroup: {
    marginTop: 10,
  },
  deleteGroup: {
    marginTop: 20,
  },
});
