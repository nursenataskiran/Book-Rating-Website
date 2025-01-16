// Giriş ve Kaydolma Formları Arasında Geçiş
const showRegister = () => {
    document.getElementById("login-card").classList.add("hidden");
    document.getElementById("register-card").classList.remove("hidden");
  };
  
  const showLogin = () => {
    document.getElementById("register-card").classList.add("hidden");
    document.getElementById("login-card").classList.remove("hidden");
  };
// Global API URL
const API_URL = 'https://localhost:44390';
  
  // Giriş Formu İşleme
  document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById("login-form");
    const ratingForm = document.getElementById("rating-form");
    
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            await login(email, password);
        });
    } else {  
        console.error('Login form not found');
    }
    if (ratingForm) {
        ratingForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const bookId = document.getElementById("book-id").value;
            const rating = document.getElementById("rating").value;
            await addRating(bookId, rating);
        });
    } else {
        console.error('Rating form not found');
    }
    
    const API_URL = 'https://localhost:44390'; // Kendi port numaranızı kullanın
    
    async function addRating(bookId, rating) {
        try {
            const response = await fetch(`${API_URL}/api/BookReview/add/${bookId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ rating })
            });
    
            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`Error ${response.status}: ${errorData}`);
            }
    
            console.log('Rating saved successfully');
        } catch (error) {
           // console.error('Failed to save rating. Please try again.', error);
        }
    }
    
    // Örnek kullanım
    document.getElementById("rating-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const bookId = document.getElementById("book-id").value;
        const rating = document.getElementById("rating").value;
        await addRating(bookId, rating);
    });
    
        console.error('Login form not found');
    }
  );
  
  
  async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Login error response:', errorData);
            throw new Error(errorData);
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.userInfo));

        window.location.href = "book-rating-homepage.html";
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please check your credentials.');
    }
  }

  // Google Books API'si için arama fonksiyonu
  async function searchBooks() {
    const searchInput = document.getElementById('searchInput').value;
    if (!searchInput) return;

    try {
        console.log('Searching for:', searchInput); // Debug için
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchInput)}&maxResults=12`);
        const data = await response.json();
        console.log('API Response:', data); // Debug için
        
        if (data.items && data.items.length > 0) {
            displayBooks(data.items);
        } else {
            document.getElementById('bookContainer').innerHTML = '<p>No books found. Try another search.</p>';
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        document.getElementById('bookContainer').innerHTML = '<p>Error fetching books. Please try again.</p>';
    }
  }

  // Kitapları görüntüleme fonksiyonu
  function displayBooks(books) {
    const bookContainer = document.getElementById('bookContainer');
    if (!bookContainer) {
        console.error('bookContainer element not found');
        return;
    }

    bookContainer.innerHTML = ''; // Önceki kitapları temizle

    if (!books || books.length === 0) {
        bookContainer.innerHTML = '<p>No books found. Try another search.</p>';
        return;
    }

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';

        const defaultCover = 'https://dummyimage.com/150x200/cccccc/000000&text=No+Cover';
        const bookId = book.id;

        bookCard.innerHTML = `
            <img src="${bookInfo.imageLinks?.thumbnail || defaultCover}" 
                 alt="${bookInfo.title}"
                 onerror="this.src='${defaultCover}'">
            <h4>${bookInfo.title}</h4>
            <p class="author">${bookInfo.authors ? bookInfo.authors.join(', ') : 'Unknown Author'}</p>
            <label for="rating-${bookId}">Rate this book:</label>
            <select id="rating-${bookId}" class="rating-dropdown">
                <option value="">Select Rating</option>
                <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
                <option value="4">⭐️⭐️⭐️⭐️</option>
                <option value="3">⭐️⭐️⭐️</option>
                <option value="2">⭐️⭐️</option>
                <option value="1">⭐️</option>
            </select>
            <div class="comments-section">
                <input type="text" id="comment-input-${bookId}" placeholder="Add a comment..." class="comment-input">
                <button onclick="saveRating('${bookId}')" class="comment-button">Save Rating</button>
                <ul id="comment-list-${bookId}" class="comment-list"></ul>
            </div>
        `;

        bookContainer.appendChild(bookCard);
    });
}

async function addReview(bookId, rating) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login to add a review');
        window.location.href = 'login.html';
        return;
    }

    const review = {
        bookId: bookId,
        rating: rating
    };

    try {
        const response = await fetch(`${API_URL}/api/BookReview/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(review)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error ${response.status}: ${errorData}`);
        }

        const data = await response.json();
        console.log(data.message);
        return true; // Başarılı olduğunda true döndür
    } catch (error) {
        console.error('Error:', error);
        return false; // Hata durumunda false döndür
    }
}

async function saveRating(bookId) {
    const ratingSelect = document.getElementById(`rating-${bookId}`);
    const rating = parseInt(ratingSelect.value);

    if (!rating) {
        alert('Please select a rating.');
        return;
    }

    const token = localStorage.getItem('token'); // Kullanıcı giriş token'ı
    if (!token) {
        alert('Please login to save a rating.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/BookRating/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ bookId, rating })
        });

        if (!response.ok) {
            throw new Error('An error occurred while saving the rating.');
        }

        alert('Rating saved successfully!');
    } catch (error) {
        console.error('Error saving rating:', error);
        //alert('Failed to save rating. Please try again.');
    }
}



// Kitabın ortalama puanını güncelle
async function updateBookRatings(bookId) {
    try {
        const response = await fetch(`api/BookReview/book/${bookId}/average-rating`);
        if (response.ok) {
            const data = await response.json();
            const ratingDisplay = document.getElementById(`rating-display-${bookId}`);
            if (ratingDisplay) {
                const stars = '⭐'.repeat(Math.round(data.averageRating));
                ratingDisplay.textContent = `Ortalama Puan: ${stars} (${data.averageRating.toFixed(1)})`;
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Kitap kartını oluştururken puan göstergesini ekle
function createBookCard(book) {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
        <h4>${book.title}</h4>
        <p class="author">${book.author}</p>
        <div id="rating-display-${book.id}" class="rating-display"></div>
        <label for="rating-${book.id}">Bu kitabı puanla:</label>
        <select id="rating-${book.id}" class="rating-dropdown">
            <option value="">Puan Seç</option>
            <option value="5">⭐️⭐️⭐️⭐️⭐️</option>
            <option value="4">⭐️⭐️⭐️⭐️</option>
            <option value="3">⭐️⭐️⭐️</option>
            <option value="2">⭐️⭐️</option>
            <option value="1">⭐️</option>
        </select>
        <button onclick="saveRating('${book.id}')" class="rating-button">Puanı Kaydet</button>
    `;
    return bookCard;
}

  // Sayfa yüklendiğinde popüler kitapları göster
  window.onload = function() {
    fetch('https://www.googleapis.com/books/v1/volumes?q=popular+books&maxResults=12')
      .then(response => response.json())
      .then(data => {
          if (data.items) {
              displayBooks(data.items);
          }
      })
      .catch(error => console.error('Error:', error));
  };
  
  // Add this function to the end of scripts.js
  function handleLogout() {
    // Clear any stored user data
    localStorage.removeItem('bookRatings');
    localStorage.removeItem('profileImage');
    localStorage.removeItem('userInfo');
    
    // Redirect to login page
    window.location.href = "login.html";
  }
  
  function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = document.querySelector('.toggle-password');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
  }
  
  // Register form işleme
  const registerForm = document.getElementById("register-form");

  async function register(fullName, email, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ fullName, email, password })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData);
        }

        alert('Registration successful! Please login.');
        showLogin();
    } catch (error) {
        console.error('Registration error:', error);
        alert(`Registration failed: ${error.message}`);
    }
  }

  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fullName = document.querySelector("#register-form input[type='text']").value;
    const email = document.querySelector("#register-form input[type='email']").value;
    const password = document.getElementById("register-password").value;
    await register(fullName, email, password);
  });
  
  function toggleRegisterPassword() {
    const passwordInput = document.getElementById('register-password');
    const toggleButton = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
  }
  
  async function updateReview(reviewId, rating, comment) {
    const token = localStorage.getItem('token');
    const review = { rating, comment };

    try {
        const response = await fetch(`${API_URL}/api/BookReview/${reviewId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(review)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error ${response.status}: ${errorData}`);
        }

        console.log('Review updated successfully');
    } catch (error) {
        console.error('Error updating review:', error);
    }
  }

  async function deleteReview(reviewId) {
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/api/BookReview/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Error ${response.status}: ${errorData}`);
        }

        console.log('Review deleted successfully');
    } catch (error) {
        console.error('Error deleting review:', error);
    }
  }
  
 
