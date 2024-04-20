using AuthenticationServer.Data;
using AuthenticationServer.Data.Repositories.RefreshToken;
using AuthenticationServer.Data.Repositories.Users;
using AuthenticationServer.Models;
using AuthenticationServer.Models.Entities;
using AuthenticationServer.Services.Hash;
using AuthenticationServer.Services.Service;
using AuthenticationServer.Services.TokenGenerator.AccesToken;
using AuthenticationServer.Services.TokenGenerator.RefreshToken;
using AuthenticationServer.Services.TokenGenerator.TokenValidators;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace AuthenticationServer.Api;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddDbContext<AuthenticationDbContext>(options =>
            options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultDb")));
        builder.Services.AddTransient<IAppUserRepository, AppUserRepository>();

        var authenticationConfiguratio = new AuthenticationConfiguration();
        builder.Configuration.Bind("Authentication", authenticationConfiguratio);
        builder.Services.AddSingleton(authenticationConfiguratio);
        builder.Services.AddSingleton<RefreshTokenValidators>();

        builder.Services.AddTransient<IAccessTokenGenerator, AccessTokenGenerator>();
        builder.Services.AddTransient<IRefreshTokenGenerator, RefreshTokenGenerator>();
        builder.Services.AddTransient<IPasswordHasher, BcryptPasswordhasher>();
        builder.Services.AddTransient<IAuthenticationService, AuthenticationService>();
        builder.Services.AddTransient<IRefreshTokenRepository, InMemoryRefreshTokenRepository>();

        builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(option =>
        {
            option.TokenValidationParameters = new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(authenticationConfiguratio.AccessTokenSecret)),
                ValidIssuer = authenticationConfiguratio.Issuer,
                ValidAudience = authenticationConfiguratio.Audience,
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ClockSkew = TimeSpan.Zero
            };
        });

        builder.Services.AddControllers();

        builder.Services.AddIdentityCore<AppUser>();

        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();


        app.MapControllers();

        app.Run();
    }
}
