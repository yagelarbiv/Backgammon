using AuthenticationServer.Data.Exeption;
using AuthenticationServer.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace AuthenticationServer.Data.Repositories.Users
{
    public class AppUserRepository(AuthenticationDbContext context) : IAppUserRepository
    {
        public async Task Add(AppUser user)
        {
            if (await UserExists(user.UserName))
                throw new DuplicateWaitObjectException($"userName: {user.UserName} already exists");

            try
            {
                await context.AppUsers.AddAsync(user);
                await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new DatabaseException("database error", ex);
            }
        }

        public async Task<AppUser> GetByUserName(string userName)
        {
            var user = await context.AppUsers.SingleOrDefaultAsync(u => u.UserName == userName);
            return user ?? throw new EntityNotFoundException("user not found");
        }

        public async Task<AppUser> GetByUserId(Guid Id)
        {
            var user = await context.AppUsers.SingleOrDefaultAsync(u => u.Id == Id);
            return user ?? throw new EntityNotFoundException("user not found");
        }

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
        public async Task<List<string>> GetAllUserNames()
        {
            return await context.AppUsers.Select(u => u.UserName).ToListAsync();
        }

<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
        public async Task<bool> UserExists(string userName)
        {
            return await context.AppUsers.AnyAsync(u => u.UserName == userName);
        }
    }
}
