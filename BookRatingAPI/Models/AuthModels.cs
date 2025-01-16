namespace BookRatingAPI.Models
{
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }

        // Oluşturucu
        public LoginModel(string email, string password)
        {
            Email = email;
            Password = password;
        }
    }

    public class RegisterModel
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        // Oluşturucu
        public RegisterModel(string fullName, string email, string password)
        {
            FullName = fullName;
            Email = email;
            Password = password;
        }
    }
}