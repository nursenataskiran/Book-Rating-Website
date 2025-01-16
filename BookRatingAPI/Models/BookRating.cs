namespace BookRatingAPI.Models
{
    public class BookRating
    {
        public int Id { get; set; }
        public int BookId { get; set; }
        public string UserId { get; set; } // Kullanıcı kimliği
        public int Rating { get; set; } // 1-5 arasında
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ApplicationUser User { get; set; }
    }
}
