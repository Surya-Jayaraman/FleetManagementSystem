using Microsoft.AspNetCore.Mvc;
using AuthService.DTOs;
using AuthService.Services;
using Microsoft.AspNetCore.Authorization;

namespace AuthService.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<LoginResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                var token = await _authService.AuthenticateAsync(loginDto.Username, loginDto.Password);
                if (token == null)
                {
                    return Unauthorized(new { Message = "Invalid username or password" });
                }

                var user = await _authService.GetUserByUsernameAsync(loginDto.Username);
                if (user == null)
                {
                    return Unauthorized();
                }

                var response = new LoginResponseDto
                {
                    Token = token,
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, "An error occurred during login");
            }
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                var user = await _authService.RegisterAsync(
                    registerDto.Username,
                    registerDto.Email,
                    registerDto.Password,
                    registerDto.Role);

                if (user == null)
                {
                    return BadRequest(new { Message = "Username or email already exists" });
                }

                var userDto = new UserDto
                {
                    UserId = user.UserId,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    IsActive = user.IsActive,
                    CreatedAt = user.CreatedAt
                };

                return CreatedAtAction(nameof(Register), userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, "An error occurred during registration");
            }
        }

        [HttpGet("validate")]
        [Authorize]
        public ActionResult ValidateToken()
        {
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            var username = User.FindFirst(System.Security.Claims.ClaimTypes.Name)?.Value;
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new
            {
                UserId = userId,
                Username = username,
                Role = role,
                Message = "Token is valid"
            });
        }
    }
}
