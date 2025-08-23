# Ontology Editor Architecture

## Overview
This project follows clean architecture principles:
- Separation of concerns (API, service, model, persistence, frontend components)
- Modularity and testability
- Extensible for future features

## Diagram

```
+-------------------+      +-------------------+      +-------------------+
|   Frontend (UI)   |<---->|   Flask API       |<---->| Ontology Service  |
+-------------------+      +-------------------+      +-------------------+
        |                        |                        |
        v                        v                        v
+-------------------+      +-------------------+      +-------------------+
| React Components  |      | Route Handlers    |      | Ontology Model    |
+-------------------+      +-------------------+      +-------------------+
        |                        |                        |
        v                        v                        v
+-------------------+      +-------------------+      +-------------------+
| Hierarchy Tree    |      | Error Handlers    |      | Persistence Layer |
+-------------------+      +-------------------+      +-------------------+
```

## Design Rationale
- **Service Layer**: Keeps business logic out of route handlers for maintainability.
- **Persistence Abstraction**: Allows switching between file and database storage easily.
- **Componentized Frontend**: Improves UI scalability and reusability.
- **Centralized Error Handling**: Ensures consistent API responses.
- **Config Management**: Uses environment variables for flexibility.
- **Accessibility**: ARIA labels and keyboard navigation for better UX.

## Deployment & Testing

### Docker Deployment
To run the full stack with Docker:

```bash
docker-compose up --build
```

This will start both backend (Flask) and frontend (React) containers.

### End-to-End Testing (Cypress)
Frontend e2e tests are located in `frontend/cypress`.

Setup:
```bash
cd frontend
npm install --save-dev cypress
npx cypress open
```

Run tests:
```bash
npx cypress run
```

### Backend Integration Tests
Run backend tests with:
```bash
python3 -m unittest discover -s tests
```

For more details, see the code comments and README sections for each module.

## Modeling Conventions

- **Domain Language**: Use terms from your subject area for class and property names. Document their meaning and intended use.
- **Explicit Relationships**: Model relationships using OWL object properties; use data properties for attributes.
- **Design Patterns**: Apply ontology design patterns (e.g., value partition, n-ary relation) where appropriate, and document your choices.
- **Annotations**: Always provide rdfs:label and rdfs:comment for classes and properties. Use custom annotation properties for metadata.
- **Expert Validation**: Review ontology structure and naming with domain experts and iterate based on feedback.
- **Decision Documentation**: Record key modeling decisions and rationale in this file or the README.
