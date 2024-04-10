import React, { useEffect, useState, useMemo, memo } from 'react';
import { formatEther } from 'viem';
import { Text } from 'react-native';

export const ANIMATION_MINIMUM_STEP_TIME = 40;

export const absoluteValue = (n: bigint) => {
  return n >= BigInt(0) ? n : -n;
};

export function toFixedUsingString(numStr: string, decimalPlaces: number): string {
  const [wholePart, decimalPart] = numStr.split('.');

  if (!decimalPart || decimalPart.length <= decimalPlaces) {
    return numStr.padEnd(wholePart.length + 1 + decimalPlaces, '0');
  }

  const decimalPartBigInt = BigInt(`${decimalPart.slice(0, decimalPlaces)}`);

  return `${wholePart}.${decimalPartBigInt.toString().padStart(decimalPlaces, '0')}`;
}

export const useSignificantFlowingDecimal = (
  flowRate: bigint,
  animationStepTimeInMs: number,
): number | undefined => useMemo(() => {

  const ticksPerSecond = 1000 / animationStepTimeInMs;
  const flowRatePerTick = flowRate / BigInt(ticksPerSecond);

  const [beforeEtherDecimal, afterEtherDecimal] = formatEther(flowRatePerTick).split('.');

  const isFlowingInWholeNumbers = absoluteValue(BigInt(beforeEtherDecimal)) > BigInt(0);

  if (isFlowingInWholeNumbers) {
    return 0; 
  }
  const numberAfterDecimalWithoutLeadingZeroes = BigInt(afterEtherDecimal);

  const lengthToFirstSignificantDecimal = afterEtherDecimal
    .toString()
    .replace(numberAfterDecimalWithoutLeadingZeroes.toString(), '').length; 

  return Math.min(lengthToFirstSignificantDecimal + 2, 18); 
}, [flowRate, animationStepTimeInMs]);

const useFlowingBalance = (
  startingBalance: bigint,
  startingBalanceDate: Date,
  flowRate: bigint
) => {
  const [flowingBalance, setFlowingBalance] = useState(startingBalance);

  const startingBalanceTime = startingBalanceDate.getTime();
  useEffect(() => {
    if (flowRate === BigInt(0)) return;

    let lastAnimationTimestamp = 0;

    const animationStep = (currentAnimationTimestamp: number) => {
      const animationFrameId = window.requestAnimationFrame(animationStep);
      if (
        currentAnimationTimestamp - lastAnimationTimestamp >
        ANIMATION_MINIMUM_STEP_TIME
      ) {
        const elapsedTimeInMilliseconds = BigInt(
          Date.now() - startingBalanceTime
        );
        const flowingBalance_ =
          startingBalance + (flowRate * elapsedTimeInMilliseconds) / BigInt(1000);

        setFlowingBalance(flowingBalance_);

        lastAnimationTimestamp = currentAnimationTimestamp;
      }

      return () => window.cancelAnimationFrame(animationFrameId);
    };

    let animationFrameId = window.requestAnimationFrame(animationStep);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [startingBalance, startingBalanceTime, flowRate]);

  return flowingBalance;
};

const FlowingBalance: React.FC<{
  startingBalance: bigint;
  startingBalanceDate: Date;
  flowRate: bigint;
}> = memo(({ startingBalance, startingBalanceDate, flowRate }) => {
  const flowingBalance = useFlowingBalance(
    startingBalance,
    startingBalanceDate,
    flowRate
  );

  const decimalPlaces = useSignificantFlowingDecimal(
    flowRate,
    ANIMATION_MINIMUM_STEP_TIME
  );

  return (
    <Text style={{color: "#15D828", fontFamily: 'Rubik', marginLeft: 12, fontSize: 15, height: 20}}>
			{toFixedUsingString(formatEther(flowingBalance), decimalPlaces)} cUSDx
		</Text>
  );
});

export default FlowingBalance;
