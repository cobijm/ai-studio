import axios from 'axios'; // Import axios

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

const getTodoWithAxios = async (todoId: number): Promise<Todo> => {
  try {
    // axios automatically throws an error for bad status codes (4xx, 5xx)
    // We can also pass the type <Todo> to get a typed response directly
    const response = await axios.get<Todo>(`https://jsonplaceholder.typicode.com/todos/${todoId}`);
    
    // The data is directly available on the `data` property
    return response.data;
  } catch (error) {
    // axios provides more detailed error information
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
};

// Call the new function
getTodoWithAxios(2)
  .then(todo => {
    console.log('Fetched Todo with Axios:', todo);
    console.log(`Title: ${todo.title}`);
  })
  .catch(error => {
    // Error handling remains the same here
  });