using BookRatingAPI.Data;
using BookRatingAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace BookRatingAPI.Repositories
{
    public class BookRatingRepository : IBookRatingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookRatingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task AddRatingAsync(BookRating rating)
        {
            await _context.BookRatings.AddAsync(rating);
            await _context.SaveChangesAsync();
        }

        public async Task<double> GetAverageRatingAsync(int bookId)
        {
            return await _context.BookRatings
                .Where(r => r.BookId == bookId)
                .AverageAsync(r => r.Rating);
        }
    }
}
