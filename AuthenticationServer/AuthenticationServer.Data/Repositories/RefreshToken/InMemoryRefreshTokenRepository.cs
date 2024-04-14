using AuthenticationServer.Data.Exeption;
using AuthenticationServer.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServer.Data.Repositories.RefreshToken
{
    public class InMemoryRefreshTokenRepository(AuthenticationDbContext context) : IRefreshTokenRepository
    {
        public Task Create(AppUser user)
        {
            throw new NotImplementedException();
        }

        public async Task<AppUser> GetByToken(string token)
        {
            var user = await context.AppUsers.SingleOrDefaultAsync(u => u.RefreshToken == token);
            return user ?? throw new EntityNotFoundException("user not found");
        }
    }
}
