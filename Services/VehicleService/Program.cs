
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using StackExchange.Redis;
using System.Text;
using VehicleService.Data;
using VehicleService.Repositories;
using VehicleService.Services;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    try
    {
        var configuration = ConfigurationOptions.Parse(
            builder.Configuration["Redis:ConnectionString"] ?? "localhost:6379,abortConnect=false,connectTimeout=1000,syncTimeout=1000");
        configuration.AbortOnConnectFail = false;
        var connection = ConnectionMultiplexer.Connect(configuration);
        sp.GetRequiredService<ILogger<Program>>().LogInformation("Redis connected successfully");
        return connection;
    }
    catch (Exception ex)
    {
        sp.GetRequiredService<ILogger<Program>>().LogWarning(ex, "Redis connection failed. Service will use database only.");
        // Return a dummy multiplexer that won't be used
        return ConnectionMultiplexer.Connect("localhost:6379,abortConnect=false,connectTimeout=100");
    }
});

builder.Services.AddSingleton<ICacheService, RedisCacheService>();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Vehicle Service API",
        Version = "v1",
        Description = "Vehicle Management Service"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddDbContext<VehicleDbContext>(options =>

{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .WithOrigins("http://localhost:4200", "https://localhost:4200", "http://localhost:5000", "https://localhost:5000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .WithExposedHeaders("*"));
});
var app = builder.Build();

// Configure the HTTP request pipeline.

  if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// Initialize database
using (var scope = app.Services.CreateScope())
{
   
  var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    try
    {
        var dbContext = scope.ServiceProvider.GetRequiredService<VehicleDbContext>();
        dbContext.Database.EnsureCreated();
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Database initialization failed. Service will continue running so Swagger and health checks remain available.");
    }

}

app.Run();
