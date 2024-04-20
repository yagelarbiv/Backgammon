using System.ComponentModel.DataAnnotations;

namespace AuthenticationServer.Api.Models.Requests
{
    public class RefreshRequest
    {
        [Required]
        public string RefreshToken { get; set; }
    }
}
