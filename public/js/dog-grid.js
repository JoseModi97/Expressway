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

                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.alt = 'Random Dog';
                    img.className = 'img-fluid rounded shadow-sm';
                    img.style.height = '200px';
                    img.style.objectFit = 'cover';

                    colDiv.appendChild(img);
                    dogGridContainer.appendChild(colDiv);
                });
                currentPage++; // Increment for the next fetch
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

    // Lightbox elements
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = -1;
    let loadedImageUrls = [];

    function openLightbox(index) {
        if (index >= 0 && index < loadedImageUrls.length) {
            currentImageIndex = index;
            lightboxImage.src = loadedImageUrls[currentImageIndex];
            lightboxCaption.textContent = `Image ${currentImageIndex + 1} of ${loadedImageUrls.length}`;
            lightboxModal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent scrolling of background
            updateLightboxNav();
        }
    }

    function closeLightbox() {
        lightboxModal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
        currentImageIndex = -1; // Reset index
    }

    function showPrevImage() {
        if (currentImageIndex > 0) {
            openLightbox(currentImageIndex - 1);
        }
    }

    function showNextImage() {
        if (currentImageIndex < loadedImageUrls.length - 1) {
            openLightbox(currentImageIndex + 1);
        }
    }

    function updateLightboxNav() {
        lightboxPrev.style.display = (currentImageIndex > 0) ? 'block' : 'none';
        lightboxNext.style.display = (currentImageIndex < loadedImageUrls.length - 1) ? 'block' : 'none';
    }

    // Event listener for clicking on images in the grid
    dogGridContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            // Update loadedImageUrls with all current images in the grid
            loadedImageUrls = Array.from(dogGridContainer.querySelectorAll('img')).map(img => img.src);
            const clickedImageSrc = event.target.src;
            const imageIndex = loadedImageUrls.indexOf(clickedImageSrc);
            if (imageIndex !== -1) {
                openLightbox(imageIndex);
            }
        }
    });

    // Event listeners for lightbox controls
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (event) => {
        if (lightboxModal.style.display === 'block') {
            if (event.key === 'Escape') {
                closeLightbox();
            } else if (event.key === 'ArrowLeft') {
                showPrevImage();
            } else if (event.key === 'ArrowRight') {
                showNextImage();
            }
        }
    });
});
