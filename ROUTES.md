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
