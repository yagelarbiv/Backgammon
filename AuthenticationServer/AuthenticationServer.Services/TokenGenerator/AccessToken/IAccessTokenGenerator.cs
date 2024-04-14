using AuthenticationServer.Models.Entities;
using AuthenticationServer.Models;
using Microsoft.IdentityModel.Tokens;

namespace AuthenticationServer.Services.TokenGenerator.AccesToken
{
    public interface IAccessTokenGenerator
    {
        string GenerateAccessToken(AppUser user);
    }
}
