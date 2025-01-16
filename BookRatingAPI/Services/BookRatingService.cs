using BookRatingAPI.DTOs;
using BookRatingAPI.Models;
using BookRatingAPI.Repositories;

namespace BookRatingAPI.Services
{
    public class BookRatingService
    {
        private readonly IBookRatingRepository _repository;

        public BookRatingService(IBookRatingRepository repository)
        {
            _repository = repository;
        }

        public async Task AddRatingAsync(BookRatingRequest request, string userId)
        {
            var rating = new BookRating
            {
                BookId = request.BookId,
                Rating = request.Rating,
                UserId = userId
            };

            await _repository.AddRatingAsync(rating);
        }

        public async Task<double> GetAverageRatingAsync(int bookId)
        {
            return await _repository.GetAverageRatingAsync(bookId);
        }
    }
}
