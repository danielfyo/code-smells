# How to run the OrderPortal tests

> SMELL: several commands, hand-started services and steps that depend on everyone's memory.

1. Start SQL Server locally and run `db/scripts/01_schema.sql` and `02_seed.sql` by hand.
2. Start RabbitMQ (`docker run ...`, the exact command is in a pinned message in the channel).
3. Export `ORDERS_TEST_CONN` with your local connection string.
4. `dotnet test tests/Core.Tests`
5. `dotnet test tests/Infrastructure.Tests` (if the first run fails, run the seed from step 1 again).
6. `dotnet test tests/Web.Tests --filter Category!=Slow` (slow ones only on Fridays).
7. Open Postman and run the "Smoke" collection for the API tests.

> SMELL: nobody runs all seven steps before each push; failures are found in CI (or in production).
