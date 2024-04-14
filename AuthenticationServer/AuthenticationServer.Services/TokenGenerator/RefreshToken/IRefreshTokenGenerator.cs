using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServer.Services.TokenGenerator.RefreshToken
{
    public interface IRefreshTokenGenerator
    {
        string GenerateRefreshToken();
    }
}
