import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Slider from '@react-native-community/slider';

export default function PositionCalculator() {
  const [accountValue, setAccountValue] = useState('10000');
  const [entryPrice, setEntryPrice] = useState('100');
  const [stopLoss, setStopLoss] = useState('95');
  const [riskPercentage, setRiskPercentage] = useState(2);
  const [riskPercentageInput, setRiskPercentageInput] = useState('2.0');

  const handleRiskInputChange = (value: string) => {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
      setRiskPercentage(parsed);
      setRiskPercentageInput(value);
    } else if (value === '') {
      setRiskPercentageInput(value);
    }
  };

  const handleSliderChange = (value: number) => {
    setRiskPercentage(value);
    setRiskPercentageInput(value.toFixed(1));
  };

  const calculatePositions = useCallback(() => {
    const account = parseFloat(accountValue) || 0;
    const entry = parseFloat(entryPrice) || 0;
    const stop = parseFloat(stopLoss) || 0;
    
    if (!account || !entry || !stop || entry <= stop) {
      return {
        riskPerShare: 0,
        maxShares: 0,
        maxSharesByPurchasePower: 0,
        targets: [],
      };
    }

    const riskPerShare = entry - stop;
    const maxRiskAmount = (account * (riskPercentage / 100));
    
    // Round down to nearest 100 shares
    const roundToHundreds = (shares: number) => Math.floor(shares / 100) * 100;
    
    const maxShares = roundToHundreds(maxRiskAmount / riskPerShare);
    const maxSharesByPurchasePower = roundToHundreds(account / entry);

    // If risk percentage is 100% or calculated shares exceed purchase power,
    // use purchase power limit instead
    const finalShares = riskPercentage === 100 || maxShares > maxSharesByPurchasePower 
      ? maxSharesByPurchasePower 
      : maxShares;

    const targets = [2, 3, 4, 5, 6].map(ratio => ({
      ratio,
      price: entry + (riskPerShare * ratio),
      profit: (riskPerShare * ratio * finalShares),
    }));

    return {
      riskPerShare,
      maxShares: finalShares,
      maxSharesByPurchasePower,
      showPurchasePowerLimit: riskPercentage === 100 || maxShares > maxSharesByPurchasePower,
      targets,
    };
  }, [accountValue, entryPrice, stopLoss, riskPercentage]);

  const { 
    riskPerShare, 
    maxShares, 
    maxSharesByPurchasePower, 
    showPurchasePowerLimit,
    targets 
  } = calculatePositions();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Account Value ($)</Text>
        <TextInput
          style={styles.input}
          value={accountValue}
          onChangeText={setAccountValue}
          keyboardType="decimal-pad"
          placeholder="Enter account value"
        />

        <Text style={styles.label}>Entry Price ($)</Text>
        <TextInput
          style={styles.input}
          value={entryPrice}
          onChangeText={setEntryPrice}
          keyboardType="decimal-pad"
          placeholder="Enter entry price"
        />

        <Text style={styles.label}>Stop Loss ($)</Text>
        <TextInput
          style={styles.input}
          value={stopLoss}
          onChangeText={setStopLoss}
          keyboardType="decimal-pad"
          placeholder="Enter stop loss"
        />

        <View style={styles.riskContainer}>
          <Text style={styles.label}>Risk Percentage</Text>
          <View style={styles.riskInputContainer}>
            <TextInput
              style={[styles.input, styles.riskInput]}
              value={riskPercentageInput}
              onChangeText={handleRiskInputChange}
              keyboardType="decimal-pad"
              placeholder="Enter risk %"
              maxLength={5}
            />
            <Text style={styles.percentageSymbol}>%</Text>
          </View>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={0.1}
          maximumValue={100}
          value={riskPercentage}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#2563eb"
          maximumTrackTintColor="#cbd5e1"
          thumbTintColor="#2563eb"
        />
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Position Details</Text>
        
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Risk per Share:</Text>
          <Text style={styles.resultValue}>${riskPerShare.toFixed(2)}</Text>
        </View>

        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Maximum Shares:</Text>
          <Text style={styles.resultValue}>{maxShares.toLocaleString()}</Text>
        </View>

        {showPurchasePowerLimit && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>
              Share quantity limited by available purchase power ({maxSharesByPurchasePower.toLocaleString()} shares at ${parseFloat(entryPrice).toFixed(2)}/share)
            </Text>
          </View>
        )}

        <Text style={[styles.resultTitle, styles.targetsTitle]}>Profit Targets</Text>
        
        {targets.map(({ ratio, price, profit }) => (
          <View key={ratio} style={styles.targetRow}>
            <Text style={styles.targetLabel}>{ratio}:1</Text>
            <View style={styles.targetDetails}>
              <Text style={styles.targetPrice}>${price.toFixed(2)}</Text>
              <Text style={styles.targetProfit}>+${profit.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  inputContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: Platform.OS === 'ios' ? 12 : 8,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  riskContainer: {
    marginBottom: 8,
  },
  riskInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskInput: {
    flex: 1,
    marginBottom: 8,
  },
  percentageSymbol: {
    fontSize: 16,
    color: '#334155',
    marginLeft: 8,
    marginBottom: 8,
  },
  slider: {
    height: 40,
    marginBottom: 16,
  },
  resultContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  targetsTitle: {
    marginTop: 24,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  resultLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  warningContainer: {
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#fdba74',
  },
  warningText: {
    color: '#c2410c',
    fontSize: 14,
    lineHeight: 20,
  },
  targetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  targetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  targetDetails: {
    alignItems: 'flex-end',
  },
  targetPrice: {
    fontSize: 16,
    color: '#334155',
    marginBottom: 4,
  },
  targetProfit: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
  },
});