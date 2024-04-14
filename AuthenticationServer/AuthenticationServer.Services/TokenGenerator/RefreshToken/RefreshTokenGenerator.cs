using AuthenticationServer.Models;
using AuthenticationServer.Models.Entities;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServer.Services.TokenGenerator.RefreshToken
{
    public class RefreshTokenGenerator(AuthenticationConfiguration Configuration) : IRefreshTokenGenerator
    {
        public string GenerateRefreshToken()
        {
            SigningCredentials credentials = GenerateCredentials(Configuration.RefreshTokenSecret);
            var utcExpirationTime = DateTime.UtcNow.AddMinutes(Configuration.RefreshTokenExpirationMinutes);

            JwtSecurityToken token = new(
                issuer: Configuration.Issuer,
                audience: Configuration.Audience,
                claims: null,
                expires: utcExpirationTime,
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private static SigningCredentials GenerateCredentials(string AccessTokenSecret)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(AccessTokenSecret));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            return credentials;
        }
    }
}
