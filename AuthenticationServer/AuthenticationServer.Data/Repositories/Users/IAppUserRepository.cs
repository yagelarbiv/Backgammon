using AuthenticationServer.Models.Entities;

namespace AuthenticationServer.Data.Repositories.Users
{
    public interface IAppUserRepository
    {
        Task<AppUser> GetByUserName(string userName);
        Task Add(AppUser User);
        Task<bool> UserExists(string userName);
        Task<AppUser> GetByUserId(Guid Id);
    }
}
