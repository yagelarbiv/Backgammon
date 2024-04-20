using AuthenticationServer.Models.Entities;
<<<<<<< HEAD
=======
using System.Collections.Generic;
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31

namespace AuthenticationServer.Data.Repositories.Users
{
    public interface IAppUserRepository
    {
        Task<AppUser> GetByUserName(string userName);
        Task Add(AppUser User);
        Task<bool> UserExists(string userName);
        Task<AppUser> GetByUserId(Guid Id);
<<<<<<< HEAD
=======
        Task<List<string>> GetAllUserNames();
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
    }
}
