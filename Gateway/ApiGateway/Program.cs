using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using MMLib.SwaggerForOcelot.DependencyInjection;
using MMLib.SwaggerForOcelot.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add Ocelot configuration
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Add Ocelot
builder.Services.AddOcelot(builder.Configuration);

// Add Swagger aggregation for downstream services
builder.Services.AddSwaggerForOcelot(builder.Configuration);

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer("Bearer", options =>
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

// CORS - Must use AllowCredentials with specific origins (not AllowAnyOrigin)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

var app = builder.Build();

var hasSwaggerEndpoints = !string.IsNullOrWhiteSpace(builder.Configuration["SwaggerEndPoints:0:Key"]);

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    if (hasSwaggerEndpoints)
    {
        app.UseSwaggerForOcelotUI(options =>
        {
            options.PathToSwaggerGenerator = "/swagger/docs";
        });
    }
    else
    {
        app.Logger.LogWarning("SwaggerForOcelot UI skipped: missing SwaggerEndPoints configuration. Add SwaggerEndPoints to ocelot.json.");
    }
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// Use Ocelot middleware
await app.UseOcelot();

app.Run();
