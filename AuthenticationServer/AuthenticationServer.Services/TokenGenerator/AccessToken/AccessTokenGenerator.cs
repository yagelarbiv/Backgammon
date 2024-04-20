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
            var claims = new Claim[] { new("Id", user.Id.ToString()), new(ClaimTypes.Name, user.UserName) };
            SigningCredentials credentials = GenerateCredentials(Configuration.AccessTokenSecret);
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======

>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
            var utcExpirationTime = DateTime.UtcNow.AddMinutes(Configuration.AccessTokenExpirationMinutes);

            JwtSecurityToken token = new(
                issuer: Configuration.Issuer,
                audience: Configuration.Audience,
                claims: claims,
                expires: utcExpirationTime,
                signingCredentials: credentials);
<<<<<<< HEAD
<<<<<<< HEAD

=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
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
