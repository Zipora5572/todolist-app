
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Mvc;
using TodoApi;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ToDoDbContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("tasks_db"),
    new MySqlServerVersion(new Version(8, 0, 41))));


builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
{
    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
}));


builder.Services.AddEndpointsApiExplorer();

builder.Services.AddAuthorization();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
        };
    });

builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
     options.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "ToDo API",
        Description = "An ASP.NET Core Web API for managing ToDo items",
    });
});
string CreateJWT(User user, IConfiguration configuration)
{
    // Define the claims for the JWT
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.Name, user.UserName),
    };

    // Create the secret key using the configured key
    var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]));
    var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

    // Create the token options
    var tokenOptions = new JwtSecurityToken(
        issuer: configuration["JWT:Issuer"],
        audience: configuration["JWT:Audience"],
        claims: claims,
        expires: DateTime.Now.AddMinutes(30), // Set expiration time as needed
        signingCredentials: signinCredentials
    );

    // Generate the token string
    return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
}


     
var app = builder.Build();


    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
        options.RoutePrefix = string.Empty;
    });



app.UseCors("MyPolicy");

app.UseAuthentication();

app.UseAuthorization();


app.MapGet("/", (HttpContext context) => "Todo API is running");

app.MapGet("/items",[Authorize]  async (ToDoDbContext db) =>
{
    try
    {
        var items = await db.Items.ToListAsync();
        return Results.Ok(items);
    }
    catch (Exception ex)
    {
        return Results.Problem("An error occurred while retrieving items: " + ex.Message);
    }
});

app.MapPost("/items",[Authorize]  async (ToDoDbContext db,[FromBody] Item item) =>
{

    try
    {
      
        db.Items.Add(item);
        await db.SaveChangesAsync();
        return Results.Created($"/items/{item.Id}", item);
    }
    catch (Exception ex)
    {
        return Results.Problem("An error occurred while adding the item: " + ex.Message);
    }
});

app.MapPut("/items/{id}",[Authorize]  async (ToDoDbContext db, int id,[FromBody] Item itemToUpdate) =>
{
    try
    {
        var item = await db.Items.FindAsync(id);
        if (item is null) return Results.NotFound();

    
        item.IsComplete = itemToUpdate.IsComplete;
       
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem("An error occurred while updating the item: " + ex.Message);
    }
});

app.MapDelete("/items/{id}",[Authorize]  async (ToDoDbContext db, int id) =>
{
    try
    {
        var item = await db.Items.FindAsync(id);
        if (item is null) return Results.NotFound();

        db.Items.Remove(item);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }
    catch (Exception ex)
    {
        return Results.Problem("An error occurred while deleting the item: " + ex.Message);
    }
});

app.MapPost("/api/auth/login", async (ToDoDbContext db,IConfiguration configuration, [FromBody] LoginModel loginModel) =>
{
    
    var user = await db.Users.FirstOrDefaultAsync(u => u.UserName == loginModel.UserName);
    if (user!=null)
    {
        var claims = new List<Claim>()
        {
            new Claim(ClaimTypes.Name, "malkabr"),
            new Claim(ClaimTypes.Role, "teacher")
        };

        var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Key"]));
        var signinCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        var tokeOptions = new JwtSecurityToken(
            issuer: configuration["JWT:Issuer"],
            audience: configuration["JWT:Audience"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(6),
            signingCredentials: signinCredentials
        );
        var tokenString = new JwtSecurityTokenHandler().WriteToken(tokeOptions);
        return Results.Ok(new { Token = tokenString });
    }
    return Results.Unauthorized();
});
app.MapPost("/api/auth/register", async (ToDoDbContext db, IConfiguration configuration, [FromBody] LoginModel loginModel) =>
{
    if (string.IsNullOrEmpty(loginModel.UserName) || string.IsNullOrEmpty(loginModel.Password))
    {
        return Results.BadRequest("Username and password are required.");
    }

    var existingUser = await db.Users.FirstOrDefaultAsync(u => u.UserName == loginModel.UserName);
    if (existingUser != null)
    {
        return Results.BadRequest("User already exists.");
    }

    var newUser = new User 
    {  
        UserName = loginModel.UserName,
        Password = loginModel.Password,    
    };

    db.Users.Add(newUser); 
    await db.SaveChangesAsync(); 
    var jwt = CreateJWT(newUser, configuration); 
    return Results.Ok(new { Token = jwt });
});



app.Run();
