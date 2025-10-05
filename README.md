# Password Vault

A simple, fast, and privacy-first password manager built with Next.js, TypeScript, and MongoDB.

## Features

*   **Password Generator:** Create strong, random passwords with customizable options.
*   **Secure Vault:** Save your passwords to a personal, encrypted vault.
*   **Client-Side Encryption:** Your passwords are encrypted on your device before being sent to the server. The server never stores plaintext passwords.
*   **Clean UI:** A minimal and fast user interface.
*   **Dark Mode:** For those who prefer the dark side.

## Tech Stack

*   **Framework:** [Next.js](https://nextjs.org/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [MongoDB](https://www.mongodb.com/)
*   **Authentication:** Simple email and password authentication.
*   **Encryption:** [crypto-js](https://github.com/brix/crypto-js)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18.17.0 or later)
*   [npm](https://www.npmjs.com/)
*   [MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/kowshik1206/password-vault-assignment-.git
    cd password-vault-assignment-
    ```

2.  Install the dependencies:

    ```bash
    npm install
    ```

3.  Set up your environment variables. Create a `.env.local` file in the root of the project and add the following:

    ```
    MONGODB_URI=<your-mongodb-connection-string>
    NEXT_PUBLIC_SECRET_KEY=<your-secret-key>
    ```

    Replace `<your-mongodb-connection-string>` with your MongoDB connection string and `<your-secret-key>` with a long, random string for encrypting your passwords.

4.  Run the development server:

    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Cryptography

This project uses `crypto-js` for client-side encryption. Specifically, it uses AES (Advanced Encryption Standard) to encrypt and decrypt passwords. This ensures that your passwords are secure and private, as they are never stored in plaintext on the server.
