import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando inyección de catálogos base...');

  // 1. Configuración del Sistema
  await prisma.systemSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
  "id": 1,
  "lateFeePercentage": 0.1,
  "quarterlyDiscount": 0.1,
  "daysBeforeLateFee": 5,
  "weeksBeforeSuspension": 4,
  "holidays": [
    "2026-01-01T00:00:00.000Z",
    "2026-02-02T00:00:00.000Z",
    "2026-03-16T00:00:00.000Z",
    "2026-05-01T00:00:00.000Z",
    "2026-09-16T00:00:00.000Z",
    "2026-11-16T00:00:00.000Z",
    "2026-12-25T00:00:00.000Z"
  ],
  "inscriptionFee": 1700,
  "patientCategories": [
    "FUNDACION",
    "PARTICULAR"
  ],
  "scheduleTypes": [
    "A",
    "B",
    "C"
  ],
  "exemptDiscountedFromLateFees": true
}
  });

  // 2. Usuarios
  await prisma.user.createMany({
    data: [
  {
    "id": "cmshvu7l90000yqy1vgfjpcw5",
    "name": "Dirección Juntos Por Los Demás",
    "username": "direccion",
    "passwordHash": "$2b$10$b9P2j3vA1u7/FcblmIEqmuLC62NE6EljHF4GZ2lUDmugLlED7m6pu",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2026-08-06T19:01:58.125Z"
  }
],
    skipDuplicates: true
  });

  // 3. Servicios
  await prisma.service.createMany({
    data: [
  {
    "id": "cmrtujqzd001bdwkdcq5v20t2",
    "name": "COGNICIÓN Y COMUNICACIÓN"
  },
  {
    "id": "cmrtujreu001ldwkdvjy9ceof",
    "name": "NEUROFEEDBACK/EDUFEED."
  },
  {
    "id": "cmrtujruc001vdwkdsl8wv09q",
    "name": "LOGOFONIATRÍA"
  },
  {
    "id": "cmrtujsa30025dwkd99fway7u",
    "name": "ESTIMULACIÓN MAGNÉTICA TRANSCRANEAL"
  },
  {
    "id": "cmrtujspn0027dwkd7x8bsm7a",
    "name": "PSICOLOGÍA"
  },
  {
    "id": "cmrtujv3p002vdwkdr58pj8j5",
    "name": "PSICOMOTRICIDAD RECREATIVA"
  },
  {
    "id": "cmru01dww00011151tn89jzhl",
    "name": "NATACIÓN"
  },
  {
    "id": "cmrtujnuw0000dwkdo0etuprh",
    "name": "MONTA TERAPÉUTICA"
  },
  {
    "id": "cmrtujodf000adwkdmq1s9hmf",
    "name": "CONOCIENDO MI CABALLO"
  },
  {
    "id": "cmrtujot0000kdwkdjwso9haa",
    "name": "EQUITACIÓN"
  },
  {
    "id": "cmrtujp8i000udwkds6ne1gud",
    "name": "VAULTING"
  },
  {
    "id": "cmrtujpo60011dwkd4c5n3ye6",
    "name": "PSICOTERAPIA ASISTIDA INDIVIDUAL"
  },
  {
    "id": "cmrtujq3s0015dwkdgmf8bu0g",
    "name": "PSICOTERAPIA ASISTIDA FAMILIAR"
  },
  {
    "id": "cmrtujqj60019dwkd5q3iux7h",
    "name": "PENSIÓN"
  },
  {
    "id": "cmrtujtcr002hdwkd3450h4ev",
    "name": "NEURODESARROLLO Y CEMS"
  },
  {
    "id": "cmrtujuo6002tdwkd7l91f1b1",
    "name": "DOMICILIO"
  },
  {
    "id": "cmrtujvj50035dwkdw84oiwk7",
    "name": "HIDROTERAPIA"
  },
  {
    "id": "cmrtujvym003fdwkd2dwqiwar",
    "name": "NATACIÓN ESPECIAL"
  },
  {
    "id": "cmrtujwe2003pdwkdgmbp4jfa",
    "name": "NATACIÓN INDIVIDUAL"
  },
  {
    "id": "cmrtujwtq003zdwkd4enu6gud",
    "name": "NATACIÓN GRUPAL"
  },
  {
    "id": "cmrtujx940049dwkd4fdj30gt",
    "name": "NADO LIBRE"
  }
],
    skipDuplicates: true
  });

  // 4. Precios de Servicios
  await prisma.servicePrice.createMany({
    data: [
  {
    "id": "cmrtujqr2001adwkdg8csi1i9",
    "serviceId": "cmrtujqj60019dwkd5q3iux7h",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 10930,
    "effectiveDate": "2026-07-20T23:19:21.902Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001cdwkdoifwe8vq",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 3550,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001ddwkdzq899xvc",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 3200,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001edwkdja1ivxvs",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2880,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001fdwkdxx4ceqzr",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 5320,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001gdwkd4xzvxj4w",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 4785,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001hdwkdu9nsefel",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 4305,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001idwkd7mf4mf52",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 7200,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001jdwkd36cebyy8",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 6480,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujr6y001kdwkdareabks7",
    "serviceId": "cmrtujqzd001bdwkdcq5v20t2",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 5830,
    "effectiveDate": "2026-07-20T23:19:22.474Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001mdwkdjruhedtn",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 3550,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001ndwkd9l4uz5ea",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 3200,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001odwkdb697edxk",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2880,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001pdwkdo304jgtx",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 5320,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001qdwkdhitw22ut",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 4785,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001rdwkdtyapgdah",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 4305,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001sdwkdtg1757ae",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 7200,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001tdwkdpx3vbxbd",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 6480,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujrmi001udwkd5tviedn1",
    "serviceId": "cmrtujreu001ldwkdvjy9ceof",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 5830,
    "effectiveDate": "2026-07-20T23:19:23.035Z",
    "isActive": true
  },
  {
    "id": "cmrtujs22001wdwkdjef8kiun",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 3550,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujs22001xdwkdri50gbal",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 3200,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujs22001ydwkdfvuzajz1",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2880,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujs23001zdwkdcnbptvqi",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 5320,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujs230020dwkddok42xc6",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 4785,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujs230021dwkdsuzvn4c1",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 4305,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujs230022dwkdpno1f71p",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 7200,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujs230023dwkdux74gqn4",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 6480,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujs230024dwkdtgtfhvkp",
    "serviceId": "cmrtujruc001vdwkdsl8wv09q",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 5830,
    "effectiveDate": "2026-07-20T23:19:23.595Z",
    "isActive": true
  },
  {
    "id": "cmrtujshx0026dwkd1mwbt0cl",
    "serviceId": "cmrtujsa30025dwkd99fway7u",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 34800,
    "effectiveDate": "2026-07-20T23:19:24.166Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i0028dwkdo8a99857",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 2825,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i0029dwkd4962nz6l",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 2543,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i002adwkd6zo786f7",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2288,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i002bdwkdwm0qzfhl",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 4240,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i002cdwkdkxfvodvy",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 3815,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i002ddwkdh922ujuc",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 3435,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i002edwkdu0zza4io",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 5760,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i002fdwkdfc8ueppd",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 5185,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujt1i002gdwkdbvxrehdc",
    "serviceId": "cmrtujspn0027dwkd7x8bsm7a",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 4665,
    "effectiveDate": "2026-07-20T23:19:24.870Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002idwkdo6c8wh3s",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 3145,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002jdwkdsuk2nmsf",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 2830,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002kdwkd1evpg06d",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2545,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002ldwkd5hh1000e",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 4720,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002mdwkdelfbyog2",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 4250,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002ndwkdlq9diaru",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 3825,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002odwkd5zxdcnrq",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 6420,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002pdwkdmmlvjzuz",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 5775,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujtp5002qdwkdebgxgj73",
    "serviceId": "cmrtujtcr002hdwkd3450h4ev",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 5200,
    "effectiveDate": "2026-07-20T23:19:25.722Z",
    "isActive": true
  },
  {
    "id": "cmrtujuw0002udwkdto3gdwv1",
    "serviceId": "cmrtujuo6002tdwkd7l91f1b1",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 935,
    "effectiveDate": "2026-07-20T23:19:27.265Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb002wdwkdcocbynki",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 1815,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb002xdwkd5npo3ac4",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 1630,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb002ydwkd3gahwa84",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 1465,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb002zdwkdoqh4o7iy",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 3520,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb0030dwkduig4ywpb",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 3168,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb0031dwkdcj0sq7e0",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 2850,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb0032dwkd6r3ikp6i",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 4920,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb0033dwkdnp3jwhn5",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 4428,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvbb0034dwkdr6bcz5rk",
    "serviceId": "cmrtujv3p002vdwkdr58pj8j5",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 3985,
    "effectiveDate": "2026-07-20T23:19:27.815Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv0036dwkdoh7m8rzx",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 2825,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv0037dwkda92v2inc",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 2543,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv0038dwkd2hawmrw5",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2288,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv0039dwkdu2bmgbzx",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 5360,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv003adwkdnroh4r1z",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 4825,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv003bdwkdv8jsjxeu",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 4345,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv003cdwkdjxhhw4gv",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 7740,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv003ddwkdvukqm0ni",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 6965,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujvqv003edwkdejyxoocf",
    "serviceId": "cmrtujvj50035dwkdw84oiwk7",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 6270,
    "effectiveDate": "2026-07-20T23:19:28.376Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003gdwkdro4ttlns",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 1815,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003hdwkd7511pcjq",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 1630,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003idwkdanpc5vt3",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 1465,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003jdwkd6lv6nxwn",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 3520,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003kdwkdswhtne12",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 3165,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003ldwkd7c8l38k0",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 2850,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003mdwkd94t4vfmc",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 4920,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0001dwkdd0phjt37",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 4455,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0002dwkd85jw4ay4",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 4010,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0003dwkdaaayvbw8",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 3605,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0004dwkde1v4b1of",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 6225,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0005dwkdshu8gil0",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 5600,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0006dwkdars56a9s",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 5040,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0007dwkdg9ylgbxf",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 8875,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0008dwkd9qkzrobi",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 7985,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujo5j0009dwkd15993gfs",
    "serviceId": "cmrtujnuw0000dwkdo0etuprh",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 7185,
    "effectiveDate": "2026-07-20T23:19:18.536Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000bdwkdgcyvc0i4",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 3300,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000cdwkdrg32jbf9",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 2970,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000ddwkd45sfeo3j",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2670,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000edwkd9egqmkc7",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 5025,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000fdwkddtjq8qly",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 4520,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000gdwkda00h5jup",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 4065,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000hdwkdp8t2pjq4",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 6765,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000idwkdbhckiju7",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 6085,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujol6000jdwkdn575p43c",
    "serviceId": "cmrtujodf000adwkdmq1s9hmf",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 5475,
    "effectiveDate": "2026-07-20T23:19:19.098Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000ldwkdrqotv14p",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 3470,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000mdwkdyr6c2ner",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 3130,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000ndwkdxn3dd800",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2810,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000odwkdr5vq8oiz",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 5050,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000pdwkdrqzaj9b3",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 4540,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000qdwkd9zwe7bn3",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 4090,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000rdwkdvadjw8ud",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 6630,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000sdwkdcgxh56hs",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 5970,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujp0n000tdwkd4x7tpc3x",
    "serviceId": "cmrtujot0000kdwkdjwso9haa",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 5370,
    "effectiveDate": "2026-07-20T23:19:19.655Z",
    "isActive": true
  },
  {
    "id": "cmrtujpg7000vdwkdye19bzux",
    "serviceId": "cmrtujp8i000udwkds6ne1gud",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 3495,
    "effectiveDate": "2026-07-20T23:19:20.215Z",
    "isActive": true
  },
  {
    "id": "cmrtujpg7000wdwkdio2jz2gu",
    "serviceId": "cmrtujp8i000udwkds6ne1gud",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 3145,
    "effectiveDate": "2026-07-20T23:19:20.215Z",
    "isActive": true
  },
  {
    "id": "cmrtujpg7000xdwkd7cyuuiff",
    "serviceId": "cmrtujp8i000udwkds6ne1gud",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2830,
    "effectiveDate": "2026-07-20T23:19:20.215Z",
    "isActive": true
  },
  {
    "id": "cmrtujpg7000ydwkdvixxr2cl",
    "serviceId": "cmrtujp8i000udwkds6ne1gud",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 4720,
    "effectiveDate": "2026-07-20T23:19:20.215Z",
    "isActive": true
  },
  {
    "id": "cmrtujpg7000zdwkdnarh36t9",
    "serviceId": "cmrtujp8i000udwkds6ne1gud",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 4245,
    "effectiveDate": "2026-07-20T23:19:20.215Z",
    "isActive": true
  },
  {
    "id": "cmrtujpg70010dwkdq0w1uiva",
    "serviceId": "cmrtujp8i000udwkds6ne1gud",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 3820,
    "effectiveDate": "2026-07-20T23:19:20.215Z",
    "isActive": true
  },
  {
    "id": "cmrtujpvw0012dwkd5qhkt8b8",
    "serviceId": "cmrtujpo60011dwkd4c5n3ye6",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 3530,
    "effectiveDate": "2026-07-20T23:19:20.780Z",
    "isActive": true
  },
  {
    "id": "cmrtujpvw0013dwkd3ox4ibwb",
    "serviceId": "cmrtujpo60011dwkd4c5n3ye6",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 3175,
    "effectiveDate": "2026-07-20T23:19:20.780Z",
    "isActive": true
  },
  {
    "id": "cmrtujpvw0014dwkdhy9slf3z",
    "serviceId": "cmrtujpo60011dwkd4c5n3ye6",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 2855,
    "effectiveDate": "2026-07-20T23:19:20.780Z",
    "isActive": true
  },
  {
    "id": "cmrtujqbf0016dwkd8cmzr4os",
    "serviceId": "cmrtujq3s0015dwkdgmf8bu0g",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 4200,
    "effectiveDate": "2026-07-20T23:19:21.340Z",
    "isActive": true
  },
  {
    "id": "cmrtujqbf0017dwkdcc4lhzxd",
    "serviceId": "cmrtujq3s0015dwkdgmf8bu0g",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 3780,
    "effectiveDate": "2026-07-20T23:19:21.340Z",
    "isActive": true
  },
  {
    "id": "cmrtujqbf0018dwkdkjbfwxqf",
    "serviceId": "cmrtujq3s0015dwkdgmf8bu0g",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 3400,
    "effectiveDate": "2026-07-20T23:19:21.340Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003ndwkd48cbrlag",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 4425,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujw6a003odwkd9cmb8b28",
    "serviceId": "cmrtujvym003fdwkd2dwqiwar",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 3983,
    "effectiveDate": "2026-07-20T23:19:28.931Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003qdwkd8t7ssp92",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 1165,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003rdwkdz6jeqjq9",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 1045,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003sdwkdsp6we11t",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 940,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003tdwkdkx69s4nz",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 2265,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003udwkdx36aola9",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 2035,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003vdwkdjqm79bd6",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 1830,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003wdwkdsozwi25b",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 3110,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003xdwkdlqo04snd",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 2795,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujwlw003ydwkdazniowvs",
    "serviceId": "cmrtujwe2003pdwkdgmbp4jfa",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 2515,
    "effectiveDate": "2026-07-20T23:19:29.492Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0040dwkdyi8idqy2",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 825,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0041dwkdp67kdj7e",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 740,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0042dwkd7agzensx",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 1,
    "scheduleType": "C",
    "monthlyPrice": 665,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0043dwkdqz96ssyg",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 2,
    "scheduleType": "A",
    "monthlyPrice": 1210,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0044dwkdo8hcpff6",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 2,
    "scheduleType": "B",
    "monthlyPrice": 1295,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0045dwkd71kdqfek",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 2,
    "scheduleType": "C",
    "monthlyPrice": 1165,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0046dwkdktbksxie",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 3,
    "scheduleType": "A",
    "monthlyPrice": 1485,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0047dwkdqglg6kwz",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 3,
    "scheduleType": "B",
    "monthlyPrice": 1337,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujx1c0048dwkde975c0qm",
    "serviceId": "cmrtujwtq003zdwkd4enu6gud",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 1203,
    "effectiveDate": "2026-07-20T23:19:30.049Z",
    "isActive": true
  },
  {
    "id": "cmrtujxgw004adwkdtsiy23s8",
    "serviceId": "cmrtujx940049dwkd4fdj30gt",
    "frequency": 1,
    "scheduleType": "A",
    "monthlyPrice": 1395,
    "effectiveDate": "2026-07-20T23:19:30.609Z",
    "isActive": true
  },
  {
    "id": "cmru01em400041151slpro6m2",
    "serviceId": "cmru01dww00011151tn89jzhl",
    "frequency": 1,
    "scheduleType": "B",
    "monthlyPrice": 900,
    "effectiveDate": "2026-07-21T01:53:04.061Z",
    "isActive": true
  },
  {
    "id": "cmru01em400051151uvfizwpd",
    "serviceId": "cmru01dww00011151tn89jzhl",
    "frequency": 3,
    "scheduleType": "C",
    "monthlyPrice": 2000,
    "effectiveDate": "2026-07-21T01:53:04.061Z",
    "isActive": true
  }
],
    skipDuplicates: true
  });

  console.log('✅ Base de datos inicializada correctamente.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
