using BookRatingAPI.DTOs;
using BookRatingAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BookRatingAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookRatingController : ControllerBase
    {
        private readonly BookRatingService _service;

        public BookRatingController(BookRatingService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("add")]
        public async Task<IActionResult> AddRating([FromBody] BookRatingRequest request)
        {
            var userId = User.Identity.Name;
            await _service.AddRatingAsync(request, userId);
            return Ok(new { message = "Rating added successfully!" });
        }

        [HttpGet("{bookId}/average-rating")]
        public async Task<IActionResult> GetAverageRating(int bookId)
        {
            var averageRating = await _service.GetAverageRatingAsync(bookId);
            return Ok(new { averageRating });
        }
    }
}
