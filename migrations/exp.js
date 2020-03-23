var payment_types = [
  {
    type: "EXPRESS",
    name: "BRONZE",
    valueInPoints: 300,
    valueInDays: 0
  },
  {
    type: "EXPRESS",
    name: "SILVER",
    valueInPoints: 500,
    valueInDays: 0
  },
  {
    type: "EXPRESS",
    name: "GOLD",
    valueInPoints: 1000,
    valueInDays: 0
  },
  {
    type: "PREMIUM",
    name: "MONTHLY",
    valueInPoints: 0,
    valueInDays: 30
  },
  {
    type: "PREMIUM",
    name: "QUARTERLY",
    valueInPoints: 0,
    valueInDays: 120
  },
  {
    type: "PREMIUM",
    name: "BI-ANNUAL",
    valueInPoints: 0,
    valueInDays: 180
  },
  {
    type: "PREMIUM",
    name: "ANNUAL",
    valueInPoints: 0,
    valueInDays: 365
  }
];

`INSERT INTO payment_plan_types (type, name, valueInPoints, valueInDays, amount) VALUES ('EXPRESS','BRONZE',300,0, 50);
INSERT INTO payment_plan_types (type, name, valueInPoints, valueInDays, amount) VALUES ('EXPRESS','SILVER',500,0, 100);
INSERT INTO payment_plan_types (type, name, valueInPoints, valueInDays, amount) VALUES ('EXPRESS','GOLD',1000,0, 150);
INSERT INTO payment_plan_types (type, name, valueInPoints, valueInDays, amount) VALUES ('PREMIUM','MONTHLY',0,30, 200);
INSERT INTO payment_plan_types (type, name, valueInPoints, valueInDays, amount) VALUES ('PREMIUM','QUARTERLY',0,120, 500);
INSERT INTO payment_plan_types (type, name, valueInPoints, valueInDays, amount) VALUES ('PREMIUM','BI-ANNUAL',0,180, 800);
INSERT INTO payment_plan_types (type, name, valueInPoints, valueInDays, amount) VALUES ('PREMIUM','ANNUAL',0,365, 1400)`;
