using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;
using Pragmap;
using Pragmap.API.Hubs;
using Pragmap.API.OperationFilters;
using Pragmap.Controllers.Entities;
using Pragmap.Domain.Entities;
using Pragmap.Infrastructure.Context;
using Pragmap.Infrastructure.Mail;
using Pragmap.Infrastructure.Mail.Service;
using Pragmap.Infrastructure.Repositories;
using Pragmap.Infrastructure.Repositories.Interfaces;
using Pragmap.Infrastructure.UnitOfWork;
using System.Reflection;
using System.Text.Json.Serialization;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

static IEdmModel GetEdmModel()
{
    var builder = new ODataConventionModelBuilder();
    builder.EnableLowerCamelCase();
    builder.EntitySet<User>("User");
    builder.EntitySet<Customer>("Customer");
    builder.EntitySet<RoadMap>("RoadMap");
    return builder.GetEdmModel();
}

// Add services to the container.

builder.Services.AddSignalR();
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
builder.Services.AddControllers()
    .AddOData(options =>
        options.AddRouteComponents("", GetEdmModel())
        .Select().Filter().Count().OrderBy().Expand().SetMaxTop(100))
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<ODataOperationFilter>();
    c.CustomOperationIds(x => string.Join("/", x.HttpMethod.ToLower(), x.RelativePath));

});

builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddTransient<IMailService, MailService>();

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));

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
        .AllowCredentials()
    );
});

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    }).AddJwtBearer(options => // Adding Jwt Bearer  
        {
            options.SaveToken = true;
            options.RequireHttpsMetadata = false;
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidAudience = builder.Configuration["JWTKey:ValidAudience"],
                ValidIssuer = builder.Configuration["JWTKey:ValidIssuer"],
                ClockSkew = TimeSpan.Zero,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWTKey:Secret"]))
            };
 
            options.Events = new JwtBearerEvents
            {
                OnChallenge = async context =>
                {
                    if (context.AuthenticateFailure != null)
                    {
                        if (context.AuthenticateFailure is SecurityTokenExpiredException)
                        {
                            context.Response.StatusCode = 498;
                            await context.Response.CompleteAsync();
                        }
                    }
                }
            };
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

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<RoadMapHub>("/roadmaphub");

app.Run();
