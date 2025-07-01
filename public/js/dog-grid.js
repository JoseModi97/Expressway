document.addEventListener('DOMContentLoaded', () => {
  const dogGridContainer = document.getElementById('dog-grid-container');
  const prevPageLink = document.getElementById('prev-page-link');
  const nextPageLink = document.getElementById('next-page-link');
  const prevPageItem = document.getElementById('prev-page-item');
  const nextPageItem = document.getElementById('next-page-item');
  const currentPageSpan = document.getElementById('current-page-span');
  const loadingAnimation = document.getElementById('loading-animation');

  let currentPage = 1;
  const imagesPerPage = 16; // Show 16 images in a 4x4 grid

  async function fetchAndDisplayImages(page) {
    if (!dogGridContainer) {
      console.error('Error: dog-grid-container not found.');
      return;
    }
    // Show skeleton loader
    dogGridContainer.innerHTML = ''; // Clear previous content
    dogGridContainer.classList.add('skeleton-loader');
    for (let i = 0; i < imagesPerPage; i++) {
      const skeletonCol = document.createElement('div');
      // Use the same column classes as the actual images for consistent layout
      skeletonCol.className = 'col-md-3 col-sm-4 mb-3 skeleton-item-wrapper';
      const skeletonDiv = document.createElement('div');
      skeletonDiv.className = 'skeleton-item';
      skeletonCol.appendChild(skeletonDiv);
      dogGridContainer.appendChild(skeletonCol);
    }

    if (loadingAnimation) loadingAnimation.style.display = 'flex'; // Show loading animation

    try {
      // Artificial delay to see skeleton loader (remove in production)
      // await new Promise(resolve => setTimeout(resolve, 1500));
      const response = await fetch(`/dog/random-batch?count=${imagesPerPage}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      dogGridContainer.innerHTML = ''; // Clear skeleton loader
      dogGridContainer.classList.remove('skeleton-loader');

      if (data.images && data.images.length > 0) {
        data.images.forEach(imageUrl => {
          const colDiv = document.createElement('div');
          colDiv.className = 'col-md-3 col-sm-4 mb-3'; // Bootstrap grid column

          const img = document.createElement('img');
          img.src = imageUrl;
          img.alt = 'Random Dog';
          img.className = 'img-fluid rounded shadow-sm'; // Bootstrap class for responsive images
          img.style.height = '200px'; // Fixed height for uniformity
          img.style.objectFit = 'cover'; // Ensure image covers the area without distortion

          colDiv.appendChild(img);
          dogGridContainer.appendChild(colDiv);
        });
      } else {
        dogGridContainer.innerHTML = '<p class="text-center">No images found. Try again!</p>';
      }
    } catch (error) {
      console.error('Error fetching dog images:', error);
       dogGridContainer.classList.remove('skeleton-loader'); // Ensure skeleton is removed on error too
      dogGridContainer.innerHTML = `<p class="text-center text-danger">Could not load images. ${error.message}</p>`;
     } finally {
       if (loadingAnimation) loadingAnimation.style.display = 'none'; // Hide loading animation
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
