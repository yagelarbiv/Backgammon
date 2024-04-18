using AuthenticationServer.Models.Entities;

public interface IAuthenticationService
{
    Task<string[]> Login(string username, string password);
    Task<string[]> Register(string username, string password);
    Task<AppUser> Refresh(string refreshToken);
    Task<string[]> ReturnTokens(AppUser user);
    Task Logout(string name);
<<<<<<< HEAD
    Task<List<string>> GetAllUsers();
=======
    Task<List<string>> AllUsersNames();
>>>>>>> b868975a51bdb5ccda79e6735f0e8e7d1e92e74c
}