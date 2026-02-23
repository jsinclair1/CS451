using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<BankDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("Default")));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// In-memory state (one shared store for the whole app while it's running)
builder.Services.AddSingleton<AccountStore>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// GET all accounts (now reads from shared store)
app.MapGet("/accounts", (AccountStore store) =>
{
    return Results.Ok(store.GetAll());
});

// GET one account by id
app.MapGet("/accounts/{accId:int}", (int accId, AccountStore store) =>
{
    var account = store.GetById(accId);

    return account is null
        ? Results.NotFound()
        : Results.Ok(account);
});

// POST create account (now saves into shared store)
app.MapPost("/accounts", (CreateAccountRequest req, AccountStore store) =>
{
    if (string.IsNullOrWhiteSpace(req.Name))
        return Results.BadRequest(new { error = "Name is required." });

    if (req.InitialBalance < 0)
        return Results.BadRequest(new { error = "InitialBalance cannot be negative." });

    var created = store.Create(req.Name, req.InitialBalance);

    return Results.Created($"/accounts/{created.accId}", created);
});



app.MapGet("/health/db", async (BankDbContext db) =>
{
    var canConnect = await db.Database.CanConnectAsync();
    return Results.Ok(new { canConnect });
});


app.Run();

// Models
record Account(int accId, string name, decimal balance);
record CreateAccountRequest(string Name, decimal InitialBalance);

// In-memory store (this is the “state”)
class AccountStore
{
    private readonly List<Account> _accounts = new()
    {
        new Account(1, "Checking", 1250.50m),
        new Account(2, "Savings", 8200.00m),
    };

    public IReadOnlyList<Account> GetAll() => _accounts;

    public Account? GetById(int accId) =>
        _accounts.FirstOrDefault(a => a.accId == accId);

    public Account Create(string name, decimal initialBalance)
    {
        var newId = _accounts.Count == 0 ? 1 : _accounts.Max(a => a.accId) + 1;
        var created = new Account(newId, name, initialBalance);
        _accounts.Add(created);
        return created;
    }
}


class BankDbContext : DbContext
{
    public BankDbContext(DbContextOptions<BankDbContext> options) : base(options) { }
}