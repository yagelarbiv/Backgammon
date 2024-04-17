using AuthenticationServer.Models.Entities;

public interface IAuthenticationService
{
    Task<string[]> Login(string username, string password);
    Task<string[]> Register(string username, string password);
    Task<AppUser> Refresh(string refreshToken);
    Task<string[]> ReturnTokens(AppUser user);
    Task Logout(string name);
}