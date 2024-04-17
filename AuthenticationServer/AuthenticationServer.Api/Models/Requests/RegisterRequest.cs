using System.ComponentModel.DataAnnotations;

namespace AuthenticationServer.Api.Models.Requests
{
    public class RegisterRequest
    {
        [Required]
        [RegularExpression(@"^[a-zA-Z0-9]{5,20}$")]
        public string UserName { get; set; }

        [Required]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$")]
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
