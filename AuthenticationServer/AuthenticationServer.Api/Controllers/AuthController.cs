using AuthenticationServer.Api.Models.Requests;
using AuthenticationServer.Api.Models.Responses;
using AuthenticationServer.Data.Repositories.Users;
using AuthenticationServer.Models.Entities;
using AuthenticationServer.Services.Service;
using AuthenticationServer.Services.TokenGenerator.TokenValidators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AuthenticationServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [EnableCors("AllowSpecificOrigin")]
    public class AuthController(IAuthenticationService service,
        RefreshTokenValidators validators) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequestModelState();

            if (!request.ConfirmPassword.Equals(request.Password))
                return BadRequest(new ErrorResponse("Passwords do not match"));

            try
            {
                var tokens = await service.Register(request.UserName, request.Password);


                Response.Cookies.Append("AccessToken", tokens[0], new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddHours(1) 
                });

                // Set the refresh token in a cookie
                Response.Cookies.Append("RefreshToken", tokens[1], new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddDays(7) 
                });

                return Ok(new AuthenticatedUserResponse
                {
                    AccessToken = tokens[0],
                    RefreshToken = tokens[1]
                });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequestModelState();

            try
            {
                var tokens = await service.Login(request.UserName, request.Password);

                Response.Cookies.Append("AccessToken", tokens[0], new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddHours(1) 
                });

                Response.Cookies.Append("RefreshToken", tokens[1], new CookieOptions
                {
                    HttpOnly = true,
                    Expires = DateTime.UtcNow.AddDays(7)
                });

                return Ok(new AuthenticatedUserResponse
                {
                    AccessToken = tokens[0],
                    RefreshToken = tokens[1]
                });
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequest request)
        {
            if (!ModelState.IsValid)
                return BadRequestModelState();
            bool valid = validators.Validate(request.RefreshToken);
            if (!valid)
                return BadRequest(new ErrorResponse("Invalid refresh token"));
            var RefreshToken = await service.Refresh(request.RefreshToken);
            if (RefreshToken == null)
                return BadRequest(new ErrorResponse("Invalid refresh token"));
            var tokens = await service.ReturnTokens(RefreshToken);
            return Ok(new AuthenticatedUserResponse
            {
                AccessToken = tokens[0],
                RefreshToken = tokens[1]
            });
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            string? rawUserName = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            if (rawUserName == null || rawUserName == "")
            {
                return Unauthorized();
            }
            else
                await service.Logout(rawUserName);
            return Ok();
        }

        private IActionResult BadRequestModelState()
        {
            IEnumerable<string> errorMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
            return BadRequest(new ErrorResponse(errorMessages));
        }

        [HttpGet("all-users")]
        public async Task<List<string>> GetAllUsernames()
        {
            var usernames = await service.GetAllUsernames();
            return usernames;
        }
    }
}