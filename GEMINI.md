# GEMINI.md - NCFCA Web Project
sempre me responda em portugues.
## Project Overview

This is a Next.js web application for the NCFCA (National Christian Forensics and Communications Association) platform. It serves as the primary interface for users to manage clubs, affiliations, dependents, and other related activities.

The application is built with **Next.js** and **TypeScript**, utilizing **Tailwind CSS** for styling. Authentication is handled by **NextAuth**, with a custom provider that communicates with a backend API. The application architecture is well-structured, separating concerns into `application`, `domain`, and `infrastructure` layers. Data fetching and state management are handled by `@tanstack/react-query` and `zustand`.

The API contract is defined in the `openapi.json` file, which serves as a single source of truth for all backend interactions.

## Building and Running

The project uses `pnpm` as the package manager.

-   **Install dependencies:**
    ```bash
    pnpm install
    ```

-   **Run the development server:**
    ```bash
    pnpm dev
    ```

-   **Build for production:**
    ```bash
    pnpm build
    ```

-   **Run the production server:**
    ```bash
    pnpm start
    ```

-   **Lint the code:**
    ```bash
    pnpm lint
    ```

## Development Conventions

-   **Project Structure:** The project follows a feature-based structure within the `src` directory, with a clear separation of concerns:
    -   `src/app`: Contains the pages and layouts of the application.
    -   `src/components`: Contains reusable UI components.
    -   `src/contracts`: Contains the DTOs for the API.
    -   `src/application`: Contains the application logic and use cases.
    -   `src/domain`: Contains the domain entities and enums.
    -   `src/infraestructure`: Contains the infrastructure services, such as authentication, gateways, and providers.
-   **TypeScript:** The project uses TypeScript with strict mode enabled. Type safety is a priority.
-   **Styling:** The project uses Tailwind CSS for styling. Utility classes are preferred over custom CSS.
-   **State Management:** For server state, the project uses `@tanstack/react-query`. For client state, it uses `zustand`.
-   **Authentication:** Authentication is handled by NextAuth, with a custom credentials provider. The authentication logic is located in `src/infraestructure/auth.ts`.
-   **API Interaction:** All interactions with the backend API are done through gateways, which are defined in the `src/application/gateways` directory. The API contract is defined in `openapi.json`.
