import { addDays, getDay, startOfMonth, format, isAfter } from 'date-fns';

/**
 * Encuentra el 5to día hábil de un mes dado.
 * Excluye Sábados (6) y Domingos (0).
 */
export function getBusinessDays(targetDate: Date): Date {
  const monthStart = startOfMonth(targetDate);
  let current = monthStart;
  let businessDaysCount = 0;

  while (businessDaysCount < 5) {
    const dayOfWeek = getDay(current);
    // 0 = Domingo, 6 = Sábado
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      businessDaysCount++;
    }
    if (businessDaysCount < 5) {
      current = addDays(current, 1);
    }
  }
  return current;
}

type CalculatePaymentInput = {
  baseAmount: number;
  currentDate: Date;
  targetMonth: Date; // Mes que se está pagando
  isQuarterlyAdvance?: boolean;
  customDiscount?: number;
  lateFeePercentage?: number;
  quarterlyDiscountPercentage?: number;
};

type CalculatePaymentOutput = {
  subtotal: number;
  lateFeeApplied: number;
  quarterlyDiscountAmount: number;
  customDiscountAmount: number;
  finalAmountPaid: number;
};

/**
 * Calcula el desglose del cobro, aplicando recargos y descuentos.
 */
export function calculateMonthlyDue(input: CalculatePaymentInput): CalculatePaymentOutput {
  const { 
    baseAmount, 
    currentDate, 
    targetMonth, 
    isQuarterlyAdvance = false,
    customDiscount = 0,
    lateFeePercentage = 0.10,
    quarterlyDiscountPercentage = 0.10
  } = input;

  let subtotal = baseAmount;
  let lateFeeApplied = 0;
  let quarterlyDiscountAmount = 0;

  // 1. Verificamos si paga trimestre adelantado
  if (isQuarterlyAdvance) {
    subtotal = baseAmount * 3;
    quarterlyDiscountAmount = subtotal * quarterlyDiscountPercentage;
  }

  // 2. Verificamos mora (solo aplica si NO hay un descuento especial aplicado)
  if (customDiscount === 0) {
    const fifthBusinessDay = getBusinessDays(targetMonth);
    // Solo se cobra recargo si NO se está pagando por adelantado
    // Y si se pagó después de la fecha límite
    if (!isQuarterlyAdvance && isAfter(currentDate, fifthBusinessDay)) {
      lateFeeApplied = baseAmount * lateFeePercentage;
    }
  }

  // 3. Calculamos total
  const finalAmountPaid = subtotal + lateFeeApplied - quarterlyDiscountAmount - customDiscount;

  return {
    subtotal,
    lateFeeApplied,
    quarterlyDiscountAmount,
    customDiscountAmount: customDiscount,
    finalAmountPaid: Math.max(finalAmountPaid, 0)
  };
}
