// SMELL: shared fixture file used by "many" suites. Edited by whoever needed a new case.
// Nobody reading a test knows which rows matter for it.
export const LEGACY_CATALOG_CSV = `sku;name;price;stock
A-001;Desk lamp;25;4
A-002;Office chair;120;2
A-003;Monitor arm;45;0
B-104;Notebook;3;100
B-105;Pen set;7;10
C-900;Discontinued stapler;12;0
`;
