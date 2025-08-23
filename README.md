
# Ontology Editor

# Ontology Editor
![Coverage Status](https://img.shields.io/badge/coverage-unknown-lightgrey.svg)

This project provides a modular backend and React frontend for ontology creation and editing, inspired by Protégé.

## Code Coverage

This project uses coverage tools to ensure high test quality and maintainability.

### How to Generate Coverage Reports

**Backend (Python):**
1. Install dependencies:
   ```bash
   pip install coverage
   ```
2. Run tests with coverage:
   ```bash
   coverage run -m unittest discover
   coverage report
   coverage html  # Generates HTML report in `htmlcov/`
   ```
3. View the HTML report by opening `htmlcov/index.html`.

**Frontend (React):**
1. Install dependencies:
   ```bash
   npm install
   ```
2. Run tests with coverage:
   ```bash
   npm test -- --coverage
   ```
3. View the coverage summary in the terminal, and open `coverage/lcov-report/index.html` for a detailed HTML report.

### CI Integration
- Coverage is checked in CI pipelines. To add a badge for live coverage, integrate with [Codecov](https://about.codecov.io/) or [Coveralls](https://coveralls.io/).
- Update the badge above with your service's URL after integration.

### Improving Coverage
- Write unit and integration tests for all new features.
- Use coverage reports to identify untested code.
- Aim for 90%+ coverage for production readiness.

For more details, see [docs/CODE_COVERAGE.md](./docs/CODE_COVERAGE.md).

## Structure

- `api/`: Flask route handlers
- `models/`: Ontology logic and data model
- `services/`: Business logic (future use)
- `utils/`: Utility functions
- `tests/`: Unit and integration tests
- `frontend/`: React-based user interface

## Setup

### Backend
1. Install dependencies:
   ```bash
   pip install flask rdflib
   ```
2. Run the backend:
   ```bash
   python app.py
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```bash
   npm start
   ```

## API Endpoints

### Classes
- `POST /classes` — Add a class
   - Body:
      ```json
      {
         "name": "ClassName", // required, 2-50 chars, alphanumeric/underscore, no spaces
         "label": "Label",     // optional
         "comment": "Comment", // optional
         "parent": "ParentClass" // optional
      }
      ```
   - Errors:
      - 400: Validation error (e.g., missing/invalid name)
      - 500: Internal error
   - Example error response:
      ```json
      { "status": "error", "error": "Class name is required and cannot be empty." }
      ```
- `GET /classes` — List all classes

### Properties
- `POST /properties` — Add a property
   - Body:
      ```json
      {
         "name": "PropertyName", // required, 2-50 chars, alphanumeric/underscore
         "type": "object"|"data", // required
         "domain": "Class",       // required
         "range": "Class",        // required
         "label": "Label",        // optional
         "comment": "Comment"      // optional
      }
      ```
   - Errors:
      - 400: Validation error (e.g., missing/invalid name/type/domain/range)
      - 500: Internal error
   - Example error response:
      ```json
      { "status": "error", "error": "Property type must be either 'object' or 'data'." }
      ```
- `GET /properties` — List all properties

### Constraints
- `POST /constraints` — Add a constraint
   - Body:
      ```json
      {
         "class": "ClassName",      // required
         "property": "PropertyName",// required
         "type": "minCardinality"|"maxCardinality"|"exactCardinality", // required
         "value": 1                  // required, integer 0-1000
      }
      ```
   - Errors:
      - 400: Validation error (e.g., missing/invalid type/value)
      - 500: Internal error
   - Example error response:
      ```json
      { "status": "error", "error": "Constraint value must be an integer." }
      ```

### Export/Import
- `GET /export?format=turtle` — Export ontology as Turtle
- `POST /import` — Import ontology file (multipart form)
   - Errors:
      - 400: No file uploaded
      - 500: Internal error

## Error Codes
- 400: Validation error (input missing/invalid)
- 401: Authentication required/failed
- 500: Internal server error

## Features
- Create/edit classes and properties
- Add constraints (cardinality)
- Add annotations (labels, comments)
- Visualize class hierarchy
- Export/import ontology files

## License
MIT
