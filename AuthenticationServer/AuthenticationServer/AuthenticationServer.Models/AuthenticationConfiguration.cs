using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AuthenticationServer.Models;

public class AuthenticationConfiguration
{
    public string AccessTokenSecret { get; set; } = null;
    public double AccessTokenExpirationMinutes { get; set; }
    public string Issuer { get; set; } = null;
    public string Audience { get; set; } = null;
    public string RefreshTokenSecret { get; set; } = null;
    public double RefreshTokenExpirationMinutes { get; set; }
}
