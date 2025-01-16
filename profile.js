document.addEventListener('DOMContentLoaded', function() {
    const imageUpload = document.getElementById('imageUpload');
    const profileImage = document.getElementById('profileImage');

    // Kullanıcı bilgilerini localStorage'dan al
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    // Kullanıcı bilgilerini göster
    if (userInfo) {
        document.getElementById('userName').textContent = userInfo.fullName;
        document.getElementById('userEmail').textContent = userInfo.email;
    } else {
        // Eğer kullanıcı bilgileri yoksa login sayfasına yönlendir
        window.location.href = 'login.html';
    }

    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            resizeImage(file, 300, 300, function(resizedImage) {
                profileImage.src = resizedImage;
                localStorage.setItem('profileImage', resizedImage);
            });
        }
    });

    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        profileImage.src = savedImage;
    }

    displayRatedBooks();
});

// Resim boyutlandırma fonksiyonu
function resizeImage(file, maxWidth, maxHeight, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            let width = img.width;
            let height = img.height;

            // En-boy oranını koru
            if (width > height) {
                if (width > maxWidth) {
                    height = height * (maxWidth / width);
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width = width * (maxHeight / height);
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Resmi base64 formatında döndür
            const resizedImage = canvas.toDataURL('image/jpeg', 0.8);
            callback(resizedImage);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}
function displayRatedBooks() {
    const ratedBooksContainer = document.getElementById('ratedBooksContainer');
    const ratings = JSON.parse(localStorage.getItem('bookRatings') || '{}');

    Object.entries(ratings).forEach(([bookId, rating]) => {
        const bookCard = document.createElement('div');
        bookCard.className = 'rated-book-card';
        bookCard.innerHTML = `
            <h4>Kitap Adı</h4>
            <p>Yazar</p>
            <div class="rating">${'⭐'.repeat(rating)}</div>
        `;
        ratedBooksContainer.appendChild(bookCard);
    });
}


function removeProfilePhoto() {
    const profileImage = document.getElementById('profileImage');
    const defaultImage = 'https://via.placeholder.com/150?text=No+Photo';
    
    // Resmi değiştir ve localStorage'dan kaldır
    profileImage.src = defaultImage;
    localStorage.removeItem('profileImage');
    
    // Resmin yüklendiğinden emin ol
    profileImage.onload = function() {
        // Resim container'ını güncelle
        const imageWrapper = document.querySelector('.profile-image-wrapper');
        if (imageWrapper) {
            imageWrapper.style.backgroundColor = '#e0e0e0';
        }
    };

    // Hata durumunda
    profileImage.onerror = function() {
        console.error('Error loading default image');
        profileImage.src = 'https://via.placeholder.com/150?text=Error';
    };
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleButton = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🔒';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
    }
}

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

async function saveRatingAndComment(bookId) {
    const rating = document.getElementById(`rating-${bookId}`).value;
    const commentInput = document.getElementById(`comment-input-${bookId}`);
    const commentText = commentInput.value.trim();

    if (!rating) {
        alert('Please select a rating.');
        return;
    }

    const success = await addReview(bookId, rating, commentText);
    if (success) {
        commentInput.value = ''; // Yorumu temizle
        alert('Rating and comment saved successfully!');
    } else {
        alert('Failed to save rating and comment. Please try again.');
    }
}