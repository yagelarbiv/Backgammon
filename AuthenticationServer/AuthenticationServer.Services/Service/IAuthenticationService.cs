using AuthenticationServer.Models.Entities;

<<<<<<< HEAD
namespace AuthenticationServer.Services.Service;

=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
public interface IAuthenticationService
{
    Task<string[]> Login(string username, string password);
    Task<string[]> Register(string username, string password);
    Task<AppUser> Refresh(string refreshToken);
    Task<string[]> ReturnTokens(AppUser user);
    Task Logout(string name);
<<<<<<< HEAD
}
=======
    Task<List<string>> GetAllUsers();

}
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
