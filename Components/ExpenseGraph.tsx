import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import tw from 'twrnc';
import { useTheme } from '../ThemeContext';

interface ExpenseGraphProps {
  data: { labels: string[], datasets: { data: number[], color?: (opacity: number) => string }[] };
}

const ExpenseGraph: React.FC<ExpenseGraphProps> = ({ data }) => {
  const { theme } = useTheme();
  const textColor = theme === 'light' ? 'text-gray-800' : 'text-gray-100';

  const chartConfig = {
    backgroundGradientFrom: '#323232', // Set background to transparent
    backgroundGradientTo: '#323232',   // Set background to transparent
    color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})`, // Set line color to lighter blue
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`, // Set label color to white
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    propsForBackgroundLines: {
      stroke: 'transparent', // Ensure background lines are transparent
    },
    propsForDots: {
      r: "3",
      strokeWidth: "2",
      stroke: "#ADD8E6" // Set dot color to lighter blue
    },
    fillShadowGradient: 'transparent', // Set the gradient under the line to transparent
    fillShadowGradientOpacity: 0 // Ensure the gradient under the line is fully transparent
  };

  // Ensure the dataset color is set to lighter blue
  const updatedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      color: (opacity = 1) => `rgba(173, 216, 230, ${opacity})` // Set dataset line color to lighter blue
    }))
  };

  return (
    <View style={tw`p-4`}>
      <Text style={tw`${textColor} text-lg font-bold mb-2`}>Expense Trends</Text>
      <LineChart
        data={updatedData}
        width={Dimensions.get('window').width - 62} // from react-native
        height={220}
        chartConfig={chartConfig}
        bezier
        style={tw`rounded-lg bg-transparent`} // Ensure the chart itself has a transparent background
      />
    </View>
  );
};

export default ExpenseGraph;
