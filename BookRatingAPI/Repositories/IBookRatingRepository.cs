using BookRatingAPI.Models;

namespace BookRatingAPI.Repositories
{
    public interface IBookRatingRepository
    {
        Task AddRatingAsync(BookRating rating);
        Task<double> GetAverageRatingAsync(int bookId);
    }
}
