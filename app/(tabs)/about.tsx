import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function About() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Position Size Calculator</Text>
        
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.text}>
          This calculator helps you determine the optimal position size for your trades based on your risk management parameters:
        </Text>
        
        <View style={styles.bulletPoints}>
          <Text style={styles.bullet}>• Enter your total account value</Text>
          <Text style={styles.bullet}>• Set your entry price and stop loss</Text>
          <Text style={styles.bullet}>• Adjust your risk percentage (0.1% to 100%)</Text>
          <Text style={styles.bullet}>• View calculated position size and profit targets</Text>
        </View>

        <Text style={styles.sectionTitle}>Risk Management</Text>
        <Text style={styles.text}>
          The calculator uses the difference between your entry price and stop loss to determine your risk per share. It then calculates the maximum number of shares you can purchase while staying within your chosen risk percentage.
        </Text>

        <Text style={styles.sectionTitle}>Profit Targets</Text>
        <Text style={styles.text}>
          Profit targets are calculated at various risk-to-reward ratios (2:1 to 6:1) based on your initial risk. These targets can help you plan your exit strategies for profitable trades.
        </Text>

        <Text style={styles.warning}>
          Remember: This is a tool to assist with position sizing. Always conduct your own research and never risk more than you can afford to lose.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
    marginTop: 20,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoints: {
    marginVertical: 16,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 8,
  },
  warning: {
    fontSize: 16,
    color: '#dc2626',
    fontWeight: '600',
    marginTop: 24,
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    overflow: 'hidden',
  },
});