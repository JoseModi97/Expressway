document.addEventListener('DOMContentLoaded', () => {
  const dogGridContainer = document.getElementById('dog-grid-container');
  const loadingAnimation = document.getElementById('loading-animation');

  let currentPage = 1; // Keep for fetching batches, but not for display
  const imagesPerFetch = 16; // Number of images to fetch each time

  async function fetchAndDisplayImages(isInitialLoad = false) {
    if (!dogGridContainer) {
      console.error('Error: dog-grid-container not found.');
      return;
    }

    if (isInitialLoad) {
      dogGridContainer.innerHTML = ''; // Clear previous content for initial load
    }

    // Show skeleton loader for the new batch
    const skeletonWrapper = document.createElement('div');
    skeletonWrapper.className = 'row g-3 skeleton-loader-batch'; // Temporary wrapper for current batch skeletons
    for (let i = 0; i < imagesPerFetch; i++) {
      const skeletonCol = document.createElement('div');
      skeletonCol.className = 'col-md-3 col-sm-4 mb-3 skeleton-item-wrapper';
      const skeletonDiv = document.createElement('div');
      skeletonDiv.className = 'skeleton-item';
      skeletonCol.appendChild(skeletonDiv);
      skeletonWrapper.appendChild(skeletonCol);
    }
    dogGridContainer.appendChild(skeletonWrapper);
    dogGridContainer.classList.add('skeleton-loader'); // General class for styling parent if needed

    if (loadingAnimation) loadingAnimation.style.display = 'flex';

    try {
      const response = await fetch(`/dog/random-batch?count=${imagesPerFetch}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Remove the skeleton items for this batch
      dogGridContainer.removeChild(skeletonWrapper);
      if (!dogGridContainer.querySelector('.skeleton-item-wrapper')) {
        dogGridContainer.classList.remove('skeleton-loader'); // Remove if no more skeletons
      }

      if (data.images && data.images.length > 0) {
        data.images.forEach(imageUrl => {
          const colDiv = document.createElement('div');
          colDiv.className = 'col-md-3 col-sm-4 mb-3';

          const anchor = document.createElement('a');
          anchor.href = imageUrl;
          anchor.dataset.fslightbox = 'gallery'; // 'gallery' can be any name, groups images

          const img = document.createElement('img');
          img.src = imageUrl;
          img.alt = 'Random Dog';
          img.className = 'img-fluid rounded shadow-sm';
          img.style.height = '200px';
          img.style.objectFit = 'cover';

          anchor.appendChild(img);
          colDiv.appendChild(anchor);
          dogGridContainer.appendChild(colDiv);
        });
        currentPage++; // Increment for the next fetch
        if (typeof refreshFsLightbox === 'function') {
          refreshFsLightbox();
        }
      } else {
        // If no images are returned, and it's not an initial load,
        // it might mean no more images to load (or an issue).
        // For now, we'll just stop trying to load more.
        if (!isInitialLoad) {
          console.log('No more images to load or empty batch received.');
          // Optionally, display a message to the user.
        } else {
           dogGridContainer.innerHTML = '<p class="text-center">No images found. Try again!</p>';
        }
      }
    } catch (error) {
      console.error('Error fetching dog images:', error);
      if (dogGridContainer.contains(skeletonWrapper)) {
        dogGridContainer.removeChild(skeletonWrapper);
      }
      if (!dogGridContainer.querySelector('.skeleton-item-wrapper')) {
         dogGridContainer.classList.remove('skeleton-loader');
      }
      // Don't clear the whole grid on error if it's not an initial load
      if (isInitialLoad) {
        dogGridContainer.innerHTML = `<p class="text-center text-danger">Could not load initial images. ${error.message}</p>`;
      } else {
        // Optionally, show a small error message at the bottom or log it.
        console.error(`Could not load more images. ${error.message}`);
      }
    } finally {
      if (loadingAnimation) loadingAnimation.style.display = 'none';
    }
  }

  let isFetching = false; // Flag to prevent multiple simultaneous fetches

  window.addEventListener('scroll', () => {
    // Check if the user has scrolled to near the bottom of the page
    // and if a fetch operation is not already in progress.
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !isFetching) {
      isFetching = true;
      fetchAndDisplayImages().finally(() => {
        isFetching = false;
      });
    }
  });

  // Initial load
  fetchAndDisplayImages(true);
});
