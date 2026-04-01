using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace NestStay.API.Extensions;

public static class ClaimsExtensions
{
    // Extrae el userId del claim Sub del JWT
    public static int GetUserId(this ClaimsPrincipal user)
    {
        var sub = user.FindFirstValue(JwtRegisteredClaimNames.Sub);
        return int.Parse(sub!);
    }
}
