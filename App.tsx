// App.tsx
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import AppNavigator from './AppNavigator';

function App() {
  return (
    <ThemeProvider>
      <AppNavigator />
    </ThemeProvider>
  );
}

export default App;
