import { describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTodosForm } from '../model';

describe('TodosForm fix verification', () => {
  beforeEach(() => {
    // Create a fresh pinia instance for each test
    const pinia = createPinia();
    setActivePinia(pinia);
  });

 it('should maintain correct element count after reorder and delete', async () => {
    const formStore = useTodosForm();
    
    // Initially there is 1 element (index "0")
    expect(Object.keys(formStore.form.ruleForm)).toHaveLength(0);
    
    // Add first element (should get index "0")
    formStore.actionAdd();
    expect(Object.keys(formStore.form.ruleForm)).toHaveLength(1);
    expect(formStore.form.ruleForm["0"]).toBeDefined();
    
    // Add another element (should get index "1")
    formStore.actionAdd();
    expect(Object.keys(formStore.form.ruleForm)).toHaveLength(2);
    expect(formStore.form.ruleForm["0"]).toBeDefined();
    expect(formStore.form.ruleForm["1"]).toBeDefined();
    
    // Now delete the element with index "1"
    formStore.actionDelete("1");
    expect(Object.keys(formStore.form.ruleForm)).toHaveLength(1);
    expect(formStore.form.ruleForm["0"]).toBeDefined();
    expect(formStore.form.ruleForm["1"]).toBeUndefined();
    
    // Now add a new element - it should get index "1" (the next available)
    formStore.actionAdd();
    expect(Object.keys(formStore.form.ruleForm)).toHaveLength(2);
    expect(formStore.form.ruleForm["0"]).toBeDefined();
    expect(formStore.form.ruleForm["1"]).toBeDefined(); // New element should have index "1"
    
    // Verify that we now have the expected 2 elements: original "0" and new "1"
    expect(Object.keys(formStore.form.ruleForm)).toEqual(["0", "1"]);
  });

  it('should generate unique keys after multiple operations', async () => {
    const formStore = useTodosForm();
    
    // Ensure clean state
    Object.keys(formStore.form.ruleForm).forEach(key => {
      delete formStore.form.ruleForm[key];
    });
    Object.keys(formStore.form.ruleFormErrors).forEach(key => {
      delete formStore.form.ruleFormErrors[key];
    });
    Object.keys(formStore.form.body.data).forEach(key => {
      delete formStore.form.body.data[key];
    });
    
    // Add 3 elements initially
    formStore.actionAdd(); // index "0"
    await new Promise(resolve => setTimeout(resolve, 0));
    formStore.actionAdd(); // index "1"
    await new Promise(resolve => setTimeout(resolve, 0));
    formStore.actionAdd(); // index "2"
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(Object.keys(formStore.form.ruleForm)).toEqual(["0", "1", "2"]);
    
    // Delete middle element
    formStore.actionDelete("1");
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(Object.keys(formStore.form.ruleForm)).toEqual(["0", "2"]);
    
    // Add new element - should get index "3"
    formStore.actionAdd();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(Object.keys(formStore.form.ruleForm)).toEqual(["0", "2", "3"]);
    
    // Delete first element (index "0")
    formStore.actionDelete("0");
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(Object.keys(formStore.form.ruleForm)).toEqual(["2", "3"]);
    
    // Add another element - should get index "4"
    formStore.actionAdd();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(Object.keys(formStore.form.ruleForm)).toEqual(["2", "3", "4"]);
  });
});