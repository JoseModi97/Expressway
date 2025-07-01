# Accessible Application Routes

This document lists the main accessible routes in this Express.js application.

## General Routes

-   **Path**: `/`
    -   **Description**: Displays the home page.
    -   **Method**: `GET`

-   **Path**: `/users`
    -   **Description**: Placeholder for users route (details depend on actual implementation in `routes/users.js`).
    -   **Method**: `GET` (typically)

## Dog API Routes

-   **Path**: `/dog/random`
    -   **Description**: Fetches a random dog image URL from the Dog CEO API and returns it as JSON.
    -   **Method**: `GET`
    -   **Example URL (assuming server on localhost:3000)**: `http://localhost:3000/dog/random`
    -   **Example Success Response**:
        ```json
        {
          "message": "https://images.dog.ceo/breeds/affenpinscher/n02110627_11550.jpg",
          "status": "success"
        }
        ```

-   **Path**: `/dog/random-batch`
    -   **Description**: Fetches a batch of random dog image URLs from the Dog CEO API.
    -   **Method**: `GET`
    -   **Query Parameters**:
        -   `count` (optional, number): Specifies the number of images to fetch. Defaults to 9.
    -   **Example URL (assuming server on localhost:3000, fetching 6 images)**: `http://localhost:3000/dog/random-batch?count=6`
    -   **Example Success Response**:
        ```json
        {
          "images": [
            "https://images.dog.ceo/breeds/hound-afghan/n02092002_10949.jpg",
            "https://images.dog.ceo/breeds/cotondetulear/100_2013.jpg",
            // ... more image URLs
          ],
          "status": "success"
        }
        ```

## Frontend Page Routes

-   **Path**: `/dogs/gallery`
    -   **Description**: Displays a paginated gallery of random dog images.
    -   **Method**: `GET`
    -   **Interaction**: Fetches images dynamically using client-side JavaScript from the `/dog/random-batch` endpoint.
