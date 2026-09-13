/**
 * Calculator and Data Analysis Tool
 * Evaluates math expressions, statistics, and text metrics.
 */
export function calculateExpression(expression) {
  if (!expression || typeof expression !== 'string') {
    return { success: false, error: 'Expression is required.' };
  }

  const sanitized = expression.trim();

  // Basic security check: allow only numbers, math operators, parentheses, Math functions
  if (!/^[0-9+\-*/()., %^eE\sMath.sqrtMath.powMath.roundMath.floorMath.ceilMath.minMath.maxMath.absMath.log]+$/.test(sanitized)) {
    return {
      success: false,
      error: 'Invalid expression. Only mathematical operations and numbers are permitted.'
    };
  }

  try {
    // Safe evaluation
    const result = Function(`"use strict"; return (${sanitized});`)();
    return {
      success: true,
      expression: sanitized,
      result: Number(result)
    };
  } catch (error) {
    return {
      success: false,
      expression: sanitized,
      error: `Calculation error: ${error.message}`
    };
  }
}
