using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AuthenticationServer.Models.Entities;

namespace AuthenticationServer.Data.Repositories.RefreshToken
{
    public interface IRefreshTokenRepository
    {
        Task<AppUser> GetByToken(string token);
        Task Create(AppUser user);
        Task Update(AppUser user);
    }
}
