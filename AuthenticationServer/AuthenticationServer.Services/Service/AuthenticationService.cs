using AuthenticationServer.Data.Exeption;
using AuthenticationServer.Data.Repositories.RefreshToken;
using AuthenticationServer.Data.Repositories.Users;
using AuthenticationServer.Models.Entities;
using AuthenticationServer.Services.Hash;
using AuthenticationServer.Services.TokenGenerator.AccesToken;
using AuthenticationServer.Services.TokenGenerator.RefreshToken;
using Microsoft.AspNetCore.Identity;

namespace AuthenticationServer.Services.Service
{
    public class AuthenticationService(
    IAppUserRepository repository,
    IRefreshTokenRepository tokenRepository,
    IPasswordHasher hasher,
    IAccessTokenGenerator tokenGenerator,
    IRefreshTokenGenerator refreshTokenGenerator) : IAuthenticationService
    {
        public async Task<string[]> Login(string username, string password)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(username);
            ArgumentException.ThrowIfNullOrWhiteSpace(password);

            if ((await repository.UserExists(username)) == false)
                throw new InvalidOperationException("User not found");

            var user = await repository.GetByUserName(username);

            if (!hasher.Verify(password, user.PasswordHash))
                throw new InvalidOperationException("Invalid password");
            string AccessToken = tokenGenerator.GenerateAccessToken(user);
            string RefreshYoken = refreshTokenGenerator.GenerateRefreshToken();
            user.RefreshToken = RefreshYoken;
            await tokenRepository.Update(user);
            return [AccessToken, RefreshYoken];
        }

        public async Task<string[]> Register(string username, string password)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(username);
            ArgumentException.ThrowIfNullOrWhiteSpace(password);

            if (await repository.UserExists(username))
                throw new InvalidOperationException("UserName Unavailable");
            string RefreshYoken = refreshTokenGenerator.GenerateRefreshToken();
            var user = new AppUser 
            { 
                UserName = username, 
                PasswordHash = hasher.Hash(password),
                RefreshToken = RefreshYoken
            };
            string AccessToken = tokenGenerator.GenerateAccessToken(user);
            try
            {
                await repository.Add(user);
                return [AccessToken, RefreshYoken];
            }
            catch (DatabaseException ex)
            {
                throw new InvalidOperationException("database error", ex);
            }
        }
        public async Task<AppUser> Refresh(string refreshToken)
        {
            return await tokenRepository.GetByToken(refreshToken);
        }

        public async Task<string[]> ReturnTokens(AppUser user)
        {
            var User = new AppUser
            {
                UserName = user.UserName,
                PasswordHash = user.PasswordHash,
                RefreshToken = user.RefreshToken
            };
            string AccessToken = tokenGenerator.GenerateAccessToken(user);
            await tokenRepository.Update(User);
            return [AccessToken, user.RefreshToken];
        }
    }
}
