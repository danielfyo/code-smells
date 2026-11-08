# How to build OrderPortal (read it all before you start!)

> SMELL: a manual, fragile, people-dependent recipe. Every step is a chance to get it wrong.

1. Install exactly SDK 8.0.1xx (it does not build with any other one, nobody knows why).
2. Ask Pete for access to the private NuGet feed and add it by hand to your user-level `NuGet.config`.
3. Copy `config/appsettings.template.json` to `src/Web/appsettings.Development.json`
   and fill in the connection string from the wiki ("Environments" page, section 4).
4. Run `dotnet restore src/Core/Core.csproj`.
5. Run the code generator: `tools/codegen/run.cmd` (Windows only; on Linux, edit the path on line 12).
6. Build `src/Core` **first**: `dotnet build src/Core/Core.csproj -c Debug`.
7. Then build `src/Infrastructure` and then `src/Web` (in that order, otherwise it fails).
8. Manually copy `lib/LegacyPdf.dll` to `src/Web/bin/Debug/net8.0/`.
9. If you see error `CS0246 'GeneratedDtos'`, go back to step 5 and repeat.

> SMELL: if something fails, "ask in the #backend channel; someone will remember".
