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
    public class RefreshTokenValidators(AuthenticationConfiguration Configuration)
    {
        public bool Validate(string refreshToken)
        {
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
