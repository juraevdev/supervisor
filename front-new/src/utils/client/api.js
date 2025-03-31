import apiClient from "./apiClient";

export const fetchAllTodos = async () => {
  try {
    const response = await apiClient.get("all-todos/");
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    return [];
  }
};

export const addTodo = async (newTodo) => {
  try {
    const response = await apiClient.post("create/", { name: newTodo });
    return response.data;
  } catch (error) {
    console.error("Error adding todo:", error);
    return null;
  }
};

export const deleteTodo = async (id) => {
  try {
    await apiClient.delete(`delete/${id}/`);
    return true;
  } catch (error) {
    console.error("Error deleting todo:", error);
    return false;
  }
};

export const updateTodo = async (id, data) => {
  try {
    await apiClient.put(`${id}/edit/`, data);
    return true;
  } catch (error) {
    console.error("Error updating todo:", error);
    return false;
  }
};
