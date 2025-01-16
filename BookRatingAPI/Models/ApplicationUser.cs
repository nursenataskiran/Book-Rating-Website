using Microsoft.AspNetCore.Identity;

namespace BookRatingAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
    }
}