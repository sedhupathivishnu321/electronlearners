"""The 8-level JR Learners Arduino kit catalogue (single source of truth for prices on the server).
Selling price = BOM component cost (incl. Arduino UNO + common core) + 40 %, rounded to the nearest rupee.

All-in-One kit: the common core ONCE (Rs 527.20) + the level-specific parts of all 8 kits (Rs 4,947.70) = Rs 5,474.90; +40 % = Rs 7,665."""

MARKUP = 0.40

KITS = [
    {"id": "prod-1", "level": 1, "name": "Level 1: Foundations Kit", "bom_cost": 605.37, "price": 848, "stock": 100, "projects": 50},
    {"id": "prod-2", "level": 2, "name": "Level 2: Sensing the World Kit", "bom_cost": 779.90, "price": 1092, "stock": 100, "projects": 50},
    {"id": "prod-3", "level": 3, "name": "Level 3: Displays & Interfaces Kit", "bom_cost": 1165.69, "price": 1632, "stock": 100, "projects": 50},
    {"id": "prod-4", "level": 4, "name": "Level 4: Motion & Distance Kit", "bom_cost": 899.05, "price": 1259, "stock": 100, "projects": 50},
    {"id": "prod-5", "level": 5, "name": "Level 5: Motors & Power Control Kit", "bom_cost": 1033.43, "price": 1447, "stock": 100, "projects": 50},
    {"id": "prod-6", "level": 6, "name": "Level 6: Smart Safety & Environment Kit", "bom_cost": 1377.68, "price": 1929, "stock": 100, "projects": 50},
    {"id": "prod-7", "level": 7, "name": "Level 7: Wireless & Remote Control Kit", "bom_cost": 1475.42, "price": 2066, "stock": 100, "projects": 50},
    {"id": "prod-8", "level": 8, "name": "Level 8: Smart Systems Capstone Kit", "bom_cost": 1828.76, "price": 2560, "stock": 100, "projects": 50},
    {"id": "prod-9", "level": 0, "name": "All-in-One Kit: all 8 levels", "bom_cost": 5474.90, "price": 7665, "stock": 100, "projects": 400},
]

KIT_BY_ID = {k["id"]: k for k in KITS}
