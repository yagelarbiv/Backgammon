using AuthenticationServer.Models;
using AuthenticationServer.Models.Entities;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AuthenticationServer.Services.TokenGenerator.AccesToken
{
    public class AccessTokenGenerator(AuthenticationConfiguration Configuration) : IAccessTokenGenerator
    {
        public string GenerateAccessToken(AppUser user)
        {
            var claims = new Claim[] { new("Id", user.Id.ToString()) };
            SigningCredentials credentials = GenerateCredentials(Configuration.AccessTokenSecret);
            var utcExpirationTime = DateTime.UtcNow.AddMinutes(Configuration.AccessTokenExpirationMinutes);

            JwtSecurityToken token = new(
                issuer: Configuration.Issuer,
                audience: Configuration.Audience,
                claims: claims,
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
