using AuthenticationServer.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServer.Services.TokenGenerator.TokenValidators
{
    public class IRefreshTokenValidators(AuthenticationConfiguration Configuration)
    {
        public bool Validate(string refreshToken)
        {
            if (string.IsNullOrEmpty(Configuration.RefreshTokenSecret) ||
                string.IsNullOrEmpty(Configuration.Issuer) ||
                string.IsNullOrEmpty(Configuration.Audience))
            {
                Configuration.RefreshTokenSecret = "3y7XS2AHicSOs2uUJCxwlHWqTJNExW3UDUjMeXi96uLEso1YV4RazqQubpFBdx0zZGtdxBelKURhh0WXxPR0mEJQHk_0U9HeYtqcMManhoP3X2Ge8jgxh6k4C_Gd4UPTc6lkx0Ca5eRE16ciFQ6wmYDnaXC8NbngGqartHccAxE";
                Configuration.Issuer = "https://localhost:6001";
                Configuration.Audience = "http://localhost";
            }
            TokenValidationParameters validationParameters = new()
            {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.RefreshTokenSecret)),
                ValidIssuer = Configuration.Issuer,
                ValidAudience = Configuration.Audience,
                ValidateIssuerSigningKey = true,
                ValidateIssuer = true,
                ValidateAudience = true,
                ClockSkew = TimeSpan.Zero
            };
            JwtSecurityTokenHandler handler = new();
            try
            {
                Console.WriteLine(refreshToken, validationParameters);
                handler.ValidateToken(refreshToken, validationParameters, out SecurityToken validatedToken);
                return true;
            } 
            catch(Exception ex)
            {
                return false;
            }
        }
    }
}
