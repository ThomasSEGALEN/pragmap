using Microsoft.EntityFrameworkCore;
using Pragmap.Infrastructure.Context;
using Pragmap.Infrastructure.Repositories;
using Pragmap.Infrastructure.Repositories.Interfaces;
using Pragmap.Infrastructure.UnitOfWork;
using System.Reflection;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

builder.Services.AddDbContext<PragmapContext>(options =>
    options.UseNpgsql(builder.Configuration["DbSettings:ConnectionString"])
);

builder.Services.AddCors(options =>
{
		options.AddPolicy("AllowSpecificOrigin",
				builder => builder
						.WithOrigins("http://localhost:4173", "http://localhost:5173")
						.AllowAnyHeader()
						.AllowAnyMethod()
						.AllowCredentials());
});

var app = builder.Build();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

}
app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection();

app.UseAuthorization();
app.UseAuthentication();
app.MapControllers();

app.UseCors("AllowSpecificOrigin");

app.Run();
