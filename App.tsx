// App.tsx
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import AppNavigator from './AppNavigator';

import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <ThemeProvider>
    {/* <ThemeProvider theme={theme}> */}
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

export default App;
