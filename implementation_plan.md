# Plan de Implementación: Carencias Operativas Básicas (MVP v1.1)

El objetivo es asegurar que la plataforma web replique estrictamente la operatividad fundamental de los archivos Excel originales, respetando las reglas dictadas por la Dirección (Daniel), sin agregar funciones "nice to have" innecesarias.

## 1. Días Hábiles, Recargo Automático (Regla de los 5 días) y Configuración de Días Festivos
**Problema:** La regla de los 5 días hábiles requiere excluir fines de semana y días festivos. Los días festivos deben poder ser configurables por la dirección.
**Solución:**
- Modificar el esquema (`prisma/schema.prisma`) para agregar un campo `holidays` (arreglo de fechas) al modelo `SystemSettings`.
- Actualizar el motor de cálculo en `src/lib/utils/financial-rules.ts` (`getBusinessDays`) para que omita fines de semana y las fechas configuradas en `SystemSettings`.
- Crear un modal de configuración global (`SettingsModal.tsx`) accesible desde la esquina superior derecha del Dashboard (`src/app/dashboard/layout.tsx` o en su cabecera).
- En la interfaz de cobro (`PaymentModal.tsx`), mostrar una alerta visual clara: "Se aplicará 10% de recargo automáticamente por fecha de pago posterior al 5to día hábil" cuando corresponda.

## 2. Descuento Manual de Dirección en Caja
**Problema:** Atención a Clientes necesita aplicar un porcentaje o cantidad de descuento manual ("Descuento de Dirección") *al momento de cobrar*.
**Solución:**
- Modificar `src/components/cobranza/PaymentModal.tsx` para agregar un campo numérico "Descuento Adicional".
- Ajustar las acciones en `src/lib/actions/payment.actions.ts` y las reglas en `financial-rules.ts` para aceptar y procesar este descuento antes del pago.

## 3. Asignación de Ahijados a Padrinos (UI Bidireccional)
**Problema:** No hay manera en la interfaz actual de relacionar los Ahijados con los Padrinos, volviendo inútil el modelo subyacente.
**Solución:**
- Modificar `src/app/dashboard/padrinos/SponsorModal.tsx` para incluir un selector múltiple (Multi-Select) que permita escoger a qué pacientes (ahijados) apadrina.
- Modificar `src/app/dashboard/pacientes/PatientForm.tsx` para incluir un campo select opcional de Padrino, facilitando la captura desde la creación del paciente.
- Modificar `src/lib/actions/patient.actions.ts` y `sponsor.actions.ts` para persistir estas relaciones correctamente.

## 4. Cuadre de Caja: Comisiones Bancarias en Padrinos
**Problema:** Los depósitos de pagos con tarjeta de crédito/transferencia (Stripe, Fondify) tienen un desfase por comisiones bancarias, lo que evita que el reporte cuadre.
**Solución:**
- Modificar `src/app/dashboard/padrinos/SponsorPaymentModal.tsx` para agregar un campo de captura "Comisión Bancaria" visible cuando se selecciona Tarjeta de Crédito u otro método digital.
- Ajustar `registerSponsorPayment` en `sponsor.actions.ts` para guardar este dato.

## 5. Reporte de Bajas y Deuda Histórica
**Problema:** Hace falta la réplica de la hoja "BAJAS", donde los pacientes suspendidos conservan su deuda histórica.
**Solución:**
- Crear la nueva página `src/app/dashboard/reportes/bajas/page.tsx`.
- Listar en ella todos los pacientes con estatus `SUSPENDED`, mostrando: Nombre, Fecha de Baja (o de actualización), Motivo de Baja (`suspensionReason`) y Monto Total Adeudado (sumando los `Charges` pendientes).

## 6. Reporte de Valoraciones Médicas (Caja Rápida)
**Problema:** Se requiere una vista idéntica a la hoja "VALORACIONES MÉDICAS" del Excel.
**Solución:**
- Modificar o agregar a `src/app/dashboard/reportes/page.tsx` una sección o tabla que filtre exclusivamente los cobros de "Caja Rápida" (`isQuickPayment = true`).
- La tabla mostrará: Nombre (o `quickPaymentName`), Fecha, Importe, Folio (`receiptNumber`) y Notas (`quickPaymentNotes`).

Con estas implementaciones estrictas, el MVP v1.1 cubrirá exactamente las reglas de negocio de la Fundación Juntos Por Los Demás, automatizando los procesos sin pasarse del alcance autorizado.
