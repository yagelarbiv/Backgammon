using AuthenticationServer.Api.Models.Requests;
using AuthenticationServer.Api.Models.Responses;
<<<<<<< HEAD
<<<<<<< HEAD
using AuthenticationServer.Data.Repositories.Users;
using AuthenticationServer.Models.Entities;
using AuthenticationServer.Services.Service;
using AuthenticationServer.Services.TokenGenerator.TokenValidators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
using AuthenticationServer.Services.TokenGenerator.TokenValidators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31

namespace AuthenticationServer.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthenticationService service,
        RefreshTokenValidators validators) : ControllerBase
    {
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
<<<<<<< HEAD
<<<<<<< HEAD
=======

>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======

>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
            if (!ModelState.IsValid)
                return BadRequestModelState();
            if (!request.ConfirmPassword.Equals(request.Password))
                return BadRequest(new ErrorResponse("Passwords do not match"));

            try
            {
                var tokens = await service.Register(request.UserName, request.Password);
<<<<<<< HEAD
<<<<<<< HEAD
                return Ok(new AuthenticatedUserResponse
                {
                    AccessToken = tokens[0],
                    RefreshToken = tokens[1]
                });
=======
                SaveTokenToCookies(tokens);
                return Ok(new { Message = "Tokens are stored in cookies." });
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
                SaveTokenToCookies(tokens);
                return Ok(new { Message = "Tokens are stored in cookies." });
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
<<<<<<< HEAD
<<<<<<< HEAD

=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
        //[HttpGet("allUsers")]
        //public async Task<IActionResult> AllUsers()
        //{
        //    if (!ModelState.IsValid)
        //        return BadRequestModelState();
        //    try
        //    {
        //        var users = await service.AllUsersNames();
        //        return Ok(users);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Problem(ex.Message);
        //    }
        //}
<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
<<<<<<< HEAD
<<<<<<< HEAD
                return BadRequestModelState();
            try
            {
                var tokens = await service.Login(request.UserName, request.Password);
                return Ok(new AuthenticatedUserResponse
                {
                    AccessToken = tokens[0],
                    RefreshToken = tokens[1]
                });
=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
                return BadRequest(ModelState);
            try
            {
                var tokens = await service.Login(request.UserName, request.Password);
                SaveTokenToCookies(tokens);

                Response.Cookies.Append("AccessToken", tokens[0], new CookieOptions
                {
                    HttpOnly = true, // to prevent access from client-side scripts
                    Secure = true,   // to ensure cookie is sent over HTTPS only
                    SameSite = SameSiteMode.Strict // to prevent CSRF
                });

                Response.Cookies.Append("RefreshToken", tokens[1], new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.Strict
                });
                return Ok(new { Message = "Tokens are stored in cookies." });
<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
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
<<<<<<< HEAD
<<<<<<< HEAD
            return Ok(new AuthenticatedUserResponse
            {
                AccessToken = tokens[0],
                RefreshToken = tokens[1]
            });
        }

        [Authorize]
        [HttpDelete("logout")]
        public async Task<IActionResult> Logout()
        {
            string? rawUsername = HttpContext.User.FindFirstValue(ClaimTypes.Name);
            if (rawUsername == null && rawUsername == "")
            {
                return Unauthorized();
            }
            else
                await service.Logout(rawUsername);
            return Ok();
=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
            SaveTokenToCookies(tokens);
            return Ok(new { Message = "Tokens are stored in cookies." });
        }

        //[Authorize]
        //[HttpPost("logout")]
        //public async Task<IActionResult> Logout()
        //{
        //    string? rawUsername = HttpContext.User.FindFirstValue(ClaimTypes.Name);
        //    if (rawUsername == null && rawUsername == "")
        //    {
        //        return Unauthorized();
        //    }
        //    else
        //        await service.Logout(rawUsername);
        //    return Ok();
        //}

        [HttpGet("AllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            if (!ModelState.IsValid)
                return BadRequestModelState();
            try
            {
                var Users = await service.GetAllUsers();
                return Ok(Users);
            }
            catch(Exception ex) 
            {
                return Problem(ex.Message);
            }
<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
        }
        private IActionResult BadRequestModelState()
        {
            IEnumerable<string> errorMessages = ModelState.Values.SelectMany(v => v.Errors.Select(b => b.ErrorMessage));
            return BadRequest(new ErrorResponse(errorMessages));
        }
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
        private void SaveTokenToCookies(string[] tokens)
        {
            Response.Cookies.Append("AccessToken", tokens[0], new CookieOptions
            {
                HttpOnly = true, // to prevent access from client-side scripts
                Secure = true,   // to ensure cookie is sent over HTTPS only
                SameSite = SameSiteMode.Strict // to prevent CSRF
            });

            Response.Cookies.Append("RefreshToken", tokens[1], new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Strict
            });
        }
<<<<<<< HEAD
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
=======
>>>>>>> 8bf81138cbffe1e1a046f97bccc40ca7af0cee31
    }
}
