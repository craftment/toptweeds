const pageSize = 10;
let currentPage = 1;

// X API 호출: 최근 트윗을 좋아요 수로 정렬
fetch('https://api.x.com/2/tweets/search/recent?query=has:video&max_results=100', {
  headers: {
    'Authorization': `Bearer YOUR_BEARER_TOKEN` // X API 인증 토큰을 입력해주세요.
  }
})
  .then(response => response.json())
  .then(data => {
    // 데이터를 좋아요 수로 정렬
    const tweets = data.data.sort((a, b) => b.public_metrics.like_count - a.public_metrics.like_count);

    // 페이지 렌더링 함수
    function renderPage(page) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      const pageData = tweets.slice(start, end);

      const videoContainer = document.getElementById('video-container');
      videoContainer.innerHTML = '';  // 이전 페이지 내용 초기화

      pageData.forEach(tweet => {
        // 동영상 정보 표시
        const videoHTML = `
          <div class="video-item">
            <h3>Posted by: ${tweet.author_id}</h3>
            <p>Likes: ${tweet.public_metrics.like_count}</p>
            <video controls>
              <source src="${tweet.video_url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <br>
            <button onclick="window.location.href='${tweet.video_url}'">Watch Video</button>
          </div>
        `;
        videoContainer.innerHTML += videoHTML;
      });
    }

    // 첫 페이지 렌더링
    renderPage(currentPage);

    // 페이지 변경 처리
    document.getElementById('nextButton').addEventListener('click', () => {
      if ((currentPage * pageSize) < tweets.length) {
        currentPage++;
        renderPage(currentPage);
      }
    });
  })
  .catch(error => {
    console.error('Error fetching video data:', error);
  });
