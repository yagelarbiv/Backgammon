using Microsoft.VisualStudio.TestTools.UnitTesting;
using AuthenticationServer.Api.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AuthenticationServer.Api.Models.Responses;
using AuthenticationServer.Services.TokenGenerator.TokenValidators;
using Microsoft.AspNetCore.Mvc;
using Moq;
using Moq.Language.Flow;
using AuthenticationServer.Api.Models.Requests;
using AuthenticationServer.Models;

namespace AuthenticationServer.Api.Controllers.Tests
{
    [TestClass]
    public class AuthControllerTests
    {
        private Mock<IAuthenticationService> _mockAuthService;
        private Mock<IRefreshTokenValidators> _mockValidators;
        private AuthController _controller;

        [TestInitialize]
        public void Setup()
        {

            var authenticationConfiguratio = new AuthenticationConfiguration();
            _mockAuthService = new Mock<IAuthenticationService>();
            _mockValidators = new Mock<IRefreshTokenValidators>(authenticationConfiguratio);
            _controller = new AuthController(_mockAuthService.Object, _mockValidators.Object);
        }

        [TestMethod]
        public async Task Register_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            _controller.ModelState.AddModelError("UserName", "Required");

            var request = new RegisterRequest
            {
                UserName = "testuser1212",
                Password = "Password123!",
                ConfirmPassword = "Password123!"
            };

            // Act
            var result = await _controller.Register(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            var badRequestResult = result as BadRequestObjectResult;
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        [TestMethod]
        public async Task Register_ReturnsBadRequest_WhenPasswordsDoNotMatch()
        {
            // Arrange
            var request = new RegisterRequest
            {
                UserName = "testuser",
                Password = "Password123!",
                ConfirmPassword = "Password1234!"
            };

            // Act
            var result = await _controller.Register(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            var badRequestResult = result as BadRequestObjectResult;
            var errorResponse = badRequestResult.Value as ErrorResponse;
            Assert.AreEqual("Passwords do not match", errorResponse.ErrorMessages == null ? "" : errorResponse.ErrorMessages.First());
        }

        [TestMethod]
        public async Task Register_ReturnsOk_WithTokens_WhenRegistrationIsSuccessful()
        {
            // Arrange
            var request = new RegisterRequest
            {
                UserName = "testuser1123",
                Password = "Password123!11",
                ConfirmPassword = "Password123!11"
            };

            var tokens = new[] { "access_token", "refresh_token" };
            _mockAuthService.Setup(s => s.Register(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(tokens);

            // Act
            var result = await _controller.Register(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(ObjectResult));
            var objectResult = result as ObjectResult;
            Assert.AreEqual(200, objectResult.StatusCode); // Ensure this matches the status code of OkObjectResult
            var response = objectResult.Value as AuthenticatedUserResponse;
            Assert.IsNotNull(response);
            Assert.AreEqual(tokens[0], response.AccessToken);
            Assert.AreEqual(tokens[1], response.RefreshToken);
        }

        [TestMethod]
        public async Task Register_ReturnsProblem_WhenExceptionIsThrown()
        {
            // Arrange
            var request = new RegisterRequest
            {
                UserName = "testuser",
                Password = "Password123!",
                ConfirmPassword = "Password123!"
            };

            _mockAuthService.Setup(s => s.Register(It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(new Exception("An error occurred"));

            // Act
            var result = await _controller.Register(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(ObjectResult));
            var problemResult = result as ObjectResult;
            Assert.AreEqual(500, problemResult.StatusCode);
        }

        [TestMethod]
        public async Task Login_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            _controller.ModelState.AddModelError("UserName", "Required");

            var request = new LoginRequest
            {
                UserName = "testuser",
                Password = "Password123!"
            };

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            var badRequestResult = result as BadRequestObjectResult;
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        [TestMethod]
        public async Task Login_ReturnsOk_WithTokens_WhenLoginIsSuccessful()
        {
            // Arrange
            var request = new LoginRequest
            {
                UserName = "testuser",
                Password = "Password123!"
            };

            var tokens = new[] { "access_token", "refresh_token" };
            _mockAuthService.Setup(s => s.Login(It.IsAny<string>(), It.IsAny<string>()))
                .ReturnsAsync(tokens);

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(ObjectResult));
            var objectResult = result as ObjectResult;
            Assert.AreEqual(200, objectResult.StatusCode); // Ensure this matches the status code of OkObjectResult
            var response = objectResult.Value as AuthenticatedUserResponse;
            Assert.IsNotNull(response);
            Assert.AreEqual(tokens[0], response.AccessToken);
            Assert.AreEqual(tokens[1], response.RefreshToken);
        }

        [TestMethod]
        public async Task Login_ReturnsProblem_WhenExceptionIsThrown()
        {
            // Arrange
            var request = new LoginRequest
            {
                UserName = "testuser",
                Password = "Password123!"
            };
            var tokens = new[] {
                "access_token",
                "refresh_token"
            };
            _mockAuthService.Setup(s => s.Login(It.IsAny<string>(), It.IsAny<string>()))
                .ThrowsAsync(new Exception("An error occurred"));

            // Act
            var result = await _controller.Login(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(ObjectResult));
            var problemResult = result as ObjectResult;
            Assert.AreEqual(500, problemResult.StatusCode);
        }

        [TestMethod]
        public async Task Refresh_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            _controller.ModelState.AddModelError("RefreshToken", "Required");   

            var request = new RefreshRequest
            {
                RefreshToken = "refresh_token"
            };

            // Act
            var result = await _controller.Refresh(request);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            var badRequestResult = result as BadRequestObjectResult;
            Assert.AreEqual(400, badRequestResult.StatusCode);
        }

        //[TestMethod]
        //public async Task Refresh_ReturnsOk_WithTokens_WhenRefreshIsSuccessful()
        //{
        //    // Arrange
        //    var request = new RefreshRequest
        //    {
        //        RefreshToken = "refresh_token"
        //    };

        //    var tokens = new[] { "access_token", "refresh_token" };
        //    _mockAuthService.Setup(s => s.Refresh(It.IsAny<string>())).ReturnsAsync(tokens);

        //    // Act
        //    var result = await _controller.Refresh(request);

        //    // Assert
        //    Assert.IsInstanceOfType(result, typeof(ObjectResult));
        //    var objectResult = result as ObjectResult;
        //    Assert.AreEqual(200, objectResult.StatusCode); // Ensure this matches the status code of OkObjectResult
        //    var response = objectResult.Value as AuthenticatedUserResponse;
        //    Assert.IsNotNull(response);
        //    Assert.AreEqual(tokens[0], response.AccessToken);
        //    Assert.AreEqual(tokens[1], response.RefreshToken);
        //}

        //[TestMethod]
        //public async Task Refresh_ReturnsProblem_WhenExceptionIsThrown()
        //{
        //    // Arrange
        //    var request = new RefreshRequest
        //    {
        //        RefreshToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjkxMDk1NjcsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjYwMDEiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.p05bML4JmD3muxYwt_FEin5bXb4lwOcWyu66FVqPib0"
        //    };
        //    var tokens = new[] {
        //        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJZCI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJ0ZXN0dXNlcjEyMTIiLCJleHAiOjE3MjEyMjY0NjcsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjYwMDEiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.vM0eFZjeKqCdxcWnERNFKAe3te88n5nw1i9SMVfvKvg",
        //        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MjkxMDk1NjcsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjYwMDEiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdCJ9.p05bML4JmD3muxYwt_FEin5bXb4lwOcWyu66FVqPib0"
        //    };
        //    _mockAuthService.Setup(s => s.Refresh(It.IsAny<string>()))
        //        .ThrowsAsync(new Exception("An error occurred"));

        //    // Act
        //    var result = await _controller.Refresh(request);

        //    // Assert
        //    Assert.IsInstanceOfType(result, typeof(ObjectResult));
        //    var problemResult = result as ObjectResult;
        //    Assert.AreEqual(500, problemResult.StatusCode);
        //}
    };
}