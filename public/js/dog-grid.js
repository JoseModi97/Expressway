document.addEventListener('DOMContentLoaded', () => {
  const dogGridContainer = document.getElementById('dog-grid-container');
  const prevPageLink = document.getElementById('prev-page-link');
  const nextPageLink = document.getElementById('next-page-link');
  const prevPageItem = document.getElementById('prev-page-item');
  const nextPageItem = document.getElementById('next-page-item');
  const currentPageSpan = document.getElementById('current-page-span');

  let currentPage = 1;
  const imagesPerPage = 9; // Show 9 images in a 3x3 grid

  async function fetchAndDisplayImages(page) {
    if (!dogGridContainer) {
      console.error('Error: dog-grid-container not found.');
      return;
    }
    // Show a loading indicator (optional)
    dogGridContainer.innerHTML = '<p class="text-center">Loading images...</p>';

    try {
      const response = await fetch(`/dog/random-batch?count=${imagesPerPage}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      dogGridContainer.innerHTML = ''; // Clear previous images or loading text

      if (data.images && data.images.length > 0) {
        data.images.forEach(imageUrl => {
          const colDiv = document.createElement('div');
          colDiv.className = 'col-md-4 col-sm-6 mb-3'; // Bootstrap grid column

          const img = document.createElement('img');
          img.src = imageUrl;
          img.alt = 'Random Dog';
          img.className = 'img-fluid rounded shadow-sm'; // Bootstrap class for responsive images
          img.style.height = '300px'; // Fixed height for uniformity
          img.style.objectFit = 'cover'; // Ensure image covers the area without distortion

          colDiv.appendChild(img);
          dogGridContainer.appendChild(colDiv);
        });
      } else {
        dogGridContainer.innerHTML = '<p class="text-center">No images found. Try again!</p>';
      }
    } catch (error) {
      console.error('Error fetching dog images:', error);
      dogGridContainer.innerHTML = `<p class="text-center text-danger">Could not load images. ${error.message}</p>`;
    }

    updatePaginationControls();
  }

  function updatePaginationControls() {
    currentPageSpan.textContent = `Page ${currentPage}`;
    if (currentPage === 1) {
      prevPageItem.classList.add('disabled');
    } else {
      prevPageItem.classList.remove('disabled');
    }
    // For this simple version, "Next" is always enabled as we fetch new random images.
    // A more advanced version might check if there are truly "more" pages from a fixed dataset.
  }

  prevPageLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      fetchAndDisplayImages(currentPage);
    }
  });

  nextPageLink.addEventListener('click', (e) => {
    e.preventDefault();
    currentPage++;
    fetchAndDisplayImages(currentPage);
  });

  // Initial load
  fetchAndDisplayImages(currentPage);
});
